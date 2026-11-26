from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class ChatRequest(BaseModel):
    question: str
    user_id: str
    thread_id: str | None = None


class ChatResponse(BaseModel):
    answer: str
    source: str
    sources: list[str] = Field(default_factory=list)
    thread_id: str


class ThreadSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    created_at: datetime


class MessageItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    role: Literal["user", "ai"]
    content: str
    created_at: datetime