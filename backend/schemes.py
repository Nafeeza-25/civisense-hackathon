import json
import os
from typing import Tuple, Dict, List

# ==========================
# SAFE SCHEME LOADER
# ==========================

DEFAULT_SCHEMES = [
    {
        "name": "Water Supply Emergency Cell",
        "categories": ["water", "sanitation"],
        "keywords": ["water", "supply", "pipeline", "drinking", "no water", "tap"],
        "min_age": None,
        "max_age": None,
        "income_groups": None,
    },
    {
        "name": "Public Health & Sanitation Scheme",
        "categories": ["health", "sanitation"],
        "keywords": ["hospital", "disease", "health", "clinic", "sanitation", "hygiene"],
        "min_age": None,
        "max_age": None,
        "income_groups": None,
    },
    {
        "name": "Urban Infrastructure Support Program",
        "categories": ["roads", "electricity", "infrastructure"],
        "keywords": ["road", "street", "pothole", "light", "electricity", "power"],
        "min_age": None,
        "max_age": None,
        "income_groups": None,
    },
    {
        "name": "Senior Citizen Welfare Assistance",
        "categories": ["welfare", "health"],
        "keywords": ["elderly", "senior", "old age", "pension"],
        "min_age": 60,
        "max_age": None,
        "income_groups": None,
    },
    {
        "name": "General Grievance Redressal Cell",
        "categories": [],
        "keywords": [],
        "min_age": None,
        "max_age": None,
        "income_groups": None,
    },
]

# Try loading JSON safely
SCHEMES: List[Dict] = DEFAULT_SCHEMES

try:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    SCHEME_PATH = os.path.join(BASE_DIR, "schemes.json")

    if os.path.exists(SCHEME_PATH):
        with open(SCHEME_PATH, "r", encoding="utf-8") as f:
            SCHEMES = json.load(f)
except Exception as e:
    print("⚠️ Schemes file load failed, using fallback schemes:", str(e))


# ==========================
# INTERNAL HELPERS
# ==========================

def _is_eligible(scheme: Dict, metadata: Dict) -> bool:
    if scheme.get("min_age") is not None:
        if metadata.get("age", 0) < scheme["min_age"]:
            return False

    if scheme.get("max_age") is not None:
        if metadata.get("age", 0) > scheme["max_age"]:
            return False

    allowed_income = scheme.get("income_groups")
    if allowed_income:
        if metadata.get("income_group") not in allowed_income:
            return False

    return True


def _keyword_score(text: str, keywords: List[str]) -> int:
    t = text.lower()
    return sum(1 for k in keywords if k.lower() in t)


# ==========================
# MAIN ENGINE
# ==========================

def map_scheme(
    category: str,
    text: str,
    area: str | None = None,
    metadata: Dict | None = None
) -> Tuple[str, str]:
    metadata = metadata or {}
    category = (category or "").lower()
    text = (text or "").lower()

    candidates = []

    for scheme in SCHEMES:
        scheme_categories = [c.lower() for c in scheme.get("categories", [])]

        if scheme_categories and category not in scheme_categories:
            continue

        if not _is_eligible(scheme, metadata):
            continue

        score = _keyword_score(text, scheme.get("keywords", []))
        candidates.append((score, scheme))

    if not candidates:
        return (
            "General Grievance Redressal Cell",
            "No matching welfare scheme found. Routed for manual government review."
        )

    candidates.sort(key=lambda x: x[0], reverse=True)
    best = candidates[0][1]

    matched_keywords = [
        k for k in best.get("keywords", [])
        if k.lower() in text
    ]

    explanation = f"Matched scheme '{best['name']}'"

    if matched_keywords:
        explanation += " using keywords: " + ", ".join(matched_keywords[:5])

    if area:
        explanation += f". Assigned to local authority for '{area}'."

    return best["name"], explanation
