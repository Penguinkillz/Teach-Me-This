"""FastAPI router for Teach Me This endpoints."""
from typing import List, Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from core.file_extract import extract_text_from_file
from tools.teach_me_this.models import ExplainRequest, ExplainResponse
from tools.teach_me_this.service import explain

router = APIRouter(prefix="/teach", tags=["Teach Me This"])


@router.post("/explain", response_model=ExplainResponse)
async def explain_topic(payload: ExplainRequest) -> ExplainResponse:
    if not payload.topic.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty.")
    return explain(payload)


@router.post("/explain-from-files", response_model=ExplainResponse)
async def explain_from_files(
    level: str = Form("Intermediate"),
    style: str = Form("Simple Explanation"),
    topic_hint: str = Form(""),
    sources_text: str = Form(""),
    files: Optional[List[UploadFile]] = File(default=None),
) -> ExplainResponse:
    extracted_parts: list[str] = []

    if sources_text.strip():
        extracted_parts.append(sources_text.strip())

    for f in files or []:
        if not f.filename:
            continue
        text = await extract_text_from_file(f)
        if text.strip():
            extracted_parts.append(f"[From {f.filename}]\n{text.strip()}")

    if not extracted_parts:
        raise HTTPException(
            status_code=400,
            detail="Provide content: paste text and/or upload a PDF or DOCX file.",
        )

    combined = "\n\n".join(extracted_parts)
    topic = topic_hint.strip() if topic_hint.strip() else combined[:300]

    return explain(
        ExplainRequest(
            topic=f"{topic}\n\n---\nSource material:\n{combined}",
            level=level,
            style=style,
        )
    )
