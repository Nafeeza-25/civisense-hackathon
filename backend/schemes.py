import json
import os
from typing import Tuple, Dict, List

# ============================
# SAFE SCHEME LOADER
# ============================

DEFAULT_SCHEMES = [
    {
        "name": "Public Water Supply Department",
        "categories": ["water", "sanitation"],
        "keywords": ["water", "no supply", "pipeline", "drinking water", "leakage"],
        "income_groups": []
    },
    {
        "name": "Municipal Roads & Transport",
        "categories": ["roads", "transport", "infrastructure"],
        "keywords": ["road", "pothole", "street light", "traffic", "bridge"],
        "income_groups": []
    },
    {
        "name": "Health & Family Welfare Scheme",
        "categories": ["health", "hospital", "medical"],
        "keywords": ["hospital", "doctor", "ambulance", "medicine", "health"],
        "income_groups": []
    },
    {
        "name": "Social Welfare Board",
        "categories": ["welfare", "pension", "housing"],
        "keywords": ["pension", "housing", "widow", "elderly", "disability", "scheme"],
        "income_groups": ["bpl", "low"]
    }
]

SCHEMES: List[Dict] = []

# Try loading from file, fallback if missing
try:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    SCHEME_PATH = os.path.join(BASE_DIR, "schemes.json")

    with open(SCHEME_PATH, "r", encoding="utf-8") as f:
        SCHEMES = json.load(f)

    print("✅ Loaded schemes.json")

except Exception as e:
    print("⚠️ schemes.json not found, using DEFAULT schemes")
    SCHEMES = DEFAULT_SCHEMES


# ============================
# INTERNAL HELPERS
# ============================

def _is_eligible(scheme: Dict, metadata: Dict) -> bool:
    """
    Check eligibility rules against user metadata
    metadata can include: age, income_group, etc.
    """
    if not metadata:
        return True

    # Age check
    if scheme.get("min_age") is not None:
        if metadata.get("age", 0) < scheme["min_age"]:
            return False

    if scheme.get("max_age") is not None:
        if metadata.get("age", 0) > scheme["max_age"]:
            return False

    # Income group check
    allowed_income = scheme.get("income_groups")
    if allowed_income:
        if metadata.get("income_group") not in allowed_income:
            return False

    return True


def _keyword_score(text: str, keywords: List[str]) -> int:
    """
    Score how many scheme keywords appear in complaint text
    """
    t = text.lower()
    return sum(1 for k in keywords if k.lower() in t)


# ============================
# MAIN ENGINE
# ============================

def map_scheme(
    category: str,
    text: str,
    area: str | None = None,
    metadata: Dict | None = None
) -> Tuple[str, str]:
    """
    Map a complaint to the best-fit welfare scheme
    Returns: (scheme_name, explanation)
    """
    metadata = metadata or {}
    category = (category or "").lower()
    text = (text or "").lower()

    candidates = []

    for scheme in SCHEMES:
        # Category match
        scheme_categories = [c.lower() for c in scheme.get("categories", [])]
        if scheme_categories and category not in scheme_categories:
            continue

        # Eligibility check
        if not _is_eligible(scheme, metadata):
            continue

        # Keyword relevance
        score = _keyword_score(text, scheme.get("keywords", []))

        if score > 0:
            candidates.append((score, scheme))

    if not candidates:
        return (
            "General Grievance Redressal Cell",
            "No specific welfare scheme matched. Routed to general grievance handling."
        )

    # Pick highest scoring scheme
    candidates.sort(key=lambda x: x[0], reverse=True)
    best = candidates[0][1]

    matched_keywords = [
        k for k in best.get("keywords", [])
        if k.lower() in text
    ]

    explanation = f"Matched scheme '{best['name']}' based on keywords: "
    explanation += ", ".join(matched_keywords[:5])

    if area:
        explanation += f". Prioritized for local office in area '{area}'."

    return best["name"], explanation
