# backend/app/services/query_router.py

def classify_query(question: str) -> str:
    # Abhi ke liye simple keyword matching
    college_keywords = ["exam", "syllabus", "notice", "date", "college", "fees", "holiday"]
    
    question_lower = question.lower()
    for word in college_keywords:
        if word in question_lower:
            return "COLLEGE"
            
    return "GENERAL"