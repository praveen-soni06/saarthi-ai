from pydantic import BaseModel
from typing import List

class ChatRequest(BaseModel):
    question: str
    userId: str

class ChatResponse(BaseModel):
    answer: str
    source: str # college | general | web
    sources: List[str] = []