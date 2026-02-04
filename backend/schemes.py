import json
import os
from typing import Tuple, Dict, List

# ==========================
# SAFE SCHEME LOADER
# ==========================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SCHEME_PATH = os.path.join(BASE_DIR, "schemes.json")

try:
    with open(SCHEME_PATH, "r", encoding="utf-8") as f:
        SCHEMES: List[Dict] = json.load(f)
    print(f"[SCHEMES] Loaded {len(SCHEMES)} welfare schemes")
except Exception as e:
    print(f"[SCHEMES] Failed to load schemes.json: {e}")
    SCHEMES = []


# ==========================
# ELIGIBILITY ENGINE
# ==========================

def _is_eligible(scheme: Dict, metadata: Dict) -> bool:
    """
    Check eligibility rules against user metadata
    metadata can include: age, income_group, occupancy, etc.
    """

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
    t = (text or "").lower()
    return sum(1 for k in keywords if k.lower() in t)


# ==========================
# MAIN SCHEME MAPPER
# ==========================

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

    # HARD FAILSAFE — NEVER CRASH API
    if not SCHEMES:
        return (
            "General Grievance Redressal Cell",
            "Scheme engine running in fallback mode (no scheme database loaded on server)."
        )

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

    # Fallback if nothing matches
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

    explanation = f"Matched scheme '{best.get('name', 'Unknown')}' using keywords: "
    explanation += ", ".join(matched_keywords[:5]) or "category relevance"

    if area:
        explanation += f". Assigned to local office for area '{area}'."

    return best.get("name", "General Grievance Redressal Cell"), explanation
