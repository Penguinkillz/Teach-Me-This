const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export interface PracticeQuestion {
  question: string;
  answer: string;
}

export interface ExplainSections {
  simple_explanation: string;
  detailed_explanation: string;
  real_life_example: string;
  key_points: string[];
  practice_questions: PracticeQuestion[];
}

export interface ExplainResponse {
  topic: string;
  level: string;
  style: string;
  sections: ExplainSections;
}

export interface ExplainParams {
  topic: string;
  level: string;
  style: string;
  sourcesText?: string;
  files?: FileList | null;
}

export async function explainTopic(params: ExplainParams): Promise<ExplainResponse> {
  const { topic, level, style, sourcesText, files } = params;
  const hasFiles = files && files.length > 0;
  const hasSources = sourcesText && sourcesText.trim().length > 0;

  if (topic && !hasFiles && !hasSources) {
    const res = await fetch(`${BASE}/api/teach/explain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, level, style }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { detail?: string };
      throw new Error(err.detail ?? `Server error ${res.status}`);
    }
    return res.json() as Promise<ExplainResponse>;
  }

  const fd = new FormData();
  fd.append("level", level);
  fd.append("style", style);
  fd.append("topic_hint", topic);
  fd.append("sources_text", sourcesText ?? "");
  if (files) {
    Array.from(files).forEach((f) => fd.append("files", f));
  }

  const res = await fetch(`${BASE}/api/teach/explain-from-files`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { detail?: string };
    throw new Error(err.detail ?? `Server error ${res.status}`);
  }
  return res.json() as Promise<ExplainResponse>;
}
