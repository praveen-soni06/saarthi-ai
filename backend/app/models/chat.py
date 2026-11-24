from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    question: str
    userId: str


class ChatResponse(BaseModel):
    answer: str
    source: str
    sources: list[str] = Field(default_factory=list)