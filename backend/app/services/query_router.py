import re

_COLLEGE_QUERY_PATTERN = re.compile(
    r"\b(?:exam|fees|syllabus|notice|date|college|holiday)\b",
    re.IGNORECASE,
)


def classify_query(question: str) -> str:
    """Classify college-related questions using a small keyword set."""
    if _COLLEGE_QUERY_PATTERN.search(question):
        return "COLLEGE"
    return "GENERAL"