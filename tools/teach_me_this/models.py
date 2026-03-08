from typing import Optional

from pydantic import BaseModel


LEVEL_OPTIONS = [
    "Explain Like I'm 10",
    "Beginner",
    "Intermediate",
    "Advanced",
    "Exam Revision Mode",
]

STYLE_OPTIONS = [
    "Simple Explanation",
    "Step-by-step Breakdown",
    "Real-life Analogies",
    "Exam-oriented Answer",
    "Bullet Summary",
]


class ExplainRequest(BaseModel):
    topic: str
    level: str = "Intermediate"
    style: str = "Simple Explanation"
    youtube_url: Optional[str] = None


class PracticeQuestion(BaseModel):
    question: str
    answer: str


class ExplainSection(BaseModel):
    simple_explanation: str
    detailed_explanation: str
    real_life_example: str
    key_points: list[str]
    practice_questions: list[PracticeQuestion]


class ExplainResponse(BaseModel):
    topic: str
    level: str
    style: str
    sections: ExplainSection
