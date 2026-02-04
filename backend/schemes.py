import json
import os
from typing import Tuple, Dict, List

# ==========================
# SAFE SCHEME LOADER
# ==========================

def _load_schemes() -> List[Dict]:
    try:
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        SCHEME_PATH = os.path.join(BASE_DIR, "schemes.json")

        with open(SCHEME_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print("⚠️ Scheme load failed:", e)
        # Fallback minimal scheme
        return [
            {
                "name": "General Grievance Redressal Cell",
                "categories": [],
                "keywords": [],
                "min_age": None,
                "max_age": None,
                "income_groups": []
            }
        ]


SCHEMES: List[Dict] = _load_schemes()

# ==========================
# ELIGIBILITY ENGINE
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
# MAIN MAPPER
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
        if score > 0:
            candidates.append((score, scheme))

    if not candidates:
        return (
            "General Grievance Redressal Cell",
            "No scheme matched. Routed to general grievance handling system."
        )

    candidates.sort(key=lambda x: x[0], reverse=True)
    best = candidates[0][1]

    matched_keywords = [
        k for k in best.get("keywords", [])
        if k.lower() in text
    ]

    explanation = f"Matched scheme '{best['name']}' using keywords: "
    explanation += ", ".join(matched_keywords[:5]) or "general relevance"

    if area:
        explanation += f". Forwarded to local office in '{area}'."

    return best["name"], explanation
