"""Core explanation logic — no FastAPI dependencies here."""
import json
import re

from fastapi import HTTPException

from core.llm import get_llm_client
from tools.teach_me_this.models import ExplainRequest, ExplainResponse, ExplainSection


_STYLE_INSTRUCTIONS = {
    "Simple Explanation": (
        "Write detailed_explanation in plain, friendly language. "
        "Avoid jargon. Use short sentences."
    ),
    "Step-by-step Breakdown": (
        "Write detailed_explanation as a numbered sequence of steps or stages. "
        "Each step should be on its own logical beat."
    ),
    "Real-life Analogies": (
        "Write detailed_explanation primarily through analogies and comparisons to "
        "everyday situations. Make abstract ideas concrete."
    ),
    "Exam-oriented Answer": (
        "Write detailed_explanation as a model exam answer: define key terms, "
        "state the core principle, give supporting points, conclude clearly. "
        "Use precise academic language appropriate for the level."
    ),
    "Bullet Summary": (
        "Write detailed_explanation as a tight set of bullet points (use • as the bullet character). "
        "Each bullet should be one clear, self-contained fact or idea. No long paragraphs."
    ),
}


def _build_prompt(payload: ExplainRequest) -> str:
    style_instruction = _STYLE_INSTRUCTIONS.get(
        payload.style,
        f"Write detailed_explanation in the '{payload.style}' style.",
    )

    return f"""You are an expert personal tutor. Explain the topic below.

Topic: {payload.topic}
Explanation Level: {payload.level}
Explanation Style: {payload.style}

Style instruction for detailed_explanation — follow this exactly:
{style_instruction}

Return ONLY valid JSON in exactly this structure (no markdown, no code fences, no control characters):
{{
  "simple_explanation": "1-3 sentence plain-language overview anyone can follow",
  "detailed_explanation": "thorough explanation following the style instruction above, calibrated to {payload.level}",
  "real_life_example": "a concrete, relatable real-world example or analogy",
  "key_points": [
    "key point 1",
    "key point 2",
    "key point 3",
    "key point 4",
    "key point 5"
  ],
  "practice_questions": [
    {{"question": "Question 1?", "answer": "Answer 1"}},
    {{"question": "Question 2?", "answer": "Answer 2"}},
    {{"question": "Question 3?", "answer": "Answer 3"}},
    {{"question": "Question 4?", "answer": "Answer 4"}},
    {{"question": "Question 5?", "answer": "Answer 5"}}
  ]
}}

Rules:
- All string values must be valid JSON — escape any special characters.
- Do NOT include newlines or tab characters inside string values; use a space instead.
- practice_questions must have exactly 5 objects, each with "question" and "answer" keys.
- Always return all 5 top-level fields.""".strip()


def _sanitize(content: str) -> str:
    content = content.lstrip("\ufeff")
    content = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', content)
    return content


_VALID_ESCAPES = set('"\\\/bfnrtu')


def _fix_json_escapes(content: str) -> str:
    """Replace invalid JSON escape sequences (e.g. \\s, \\.) with the literal character."""
    result = []
    i = 0
    while i < len(content):
        ch = content[i]
        if ch == '\\' and i + 1 < len(content):
            next_ch = content[i + 1]
            if next_ch in _VALID_ESCAPES:
                result.append(ch)
                result.append(next_ch)
                i += 2
            else:
                # Drop the backslash, keep the literal character
                result.append(next_ch)
                i += 2
        else:
            result.append(ch)
            i += 1
    return ''.join(result)


def _parse_response(content: str) -> dict:
    content = _sanitize(content)
    content = _fix_json_escapes(content)
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        start, end = content.find("{"), content.rfind("}")
        if start != -1 and end > start:
            try:
                return json.loads(content[start : end + 1])
            except json.JSONDecodeError:
                pass
        raise


def explain(payload: ExplainRequest) -> ExplainResponse:
    client, model = get_llm_client()
    prompt = _build_prompt(payload)

    try:
        completion = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": "You are a personal tutor. Return clean JSON only — no markdown, no code fences.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            response_format={"type": "json_object"},
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"LLM API error: {exc}") from exc

    raw = completion.choices[0].message.content or ""

    try:
        data = _parse_response(raw)
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=502, detail=f"Failed to parse model output: {exc}"
        ) from exc

    required_fields = {
        "simple_explanation",
        "detailed_explanation",
        "real_life_example",
        "key_points",
        "practice_questions",
    }
    missing = required_fields - data.keys()
    if missing:
        raise HTTPException(
            status_code=502,
            detail=f"Model response missing fields: {', '.join(missing)}",
        )

    try:
        sections = ExplainSection(**data)
    except Exception as exc:
        raise HTTPException(
            status_code=502, detail=f"Invalid model response structure: {exc}"
        ) from exc

    return ExplainResponse(
        topic=payload.topic,
        level=payload.level,
        style=payload.style,
        sections=sections,
    )
