from __future__ import annotations

from typing import Tuple

from sqlalchemy.orm import Session

from db import Complaint


def compute_urgency(text: str) -> float:
    """
    Simple rule-based urgency score in [0, 1].

    You can later replace this with a learned model.
    """
    t = (text or "").lower()
    score = 0.3

    urgent_keywords = [
        "immediately",
        "urgent",
        "emergency",
        "life threatening",
        "danger",
        "accident",
        "collapsed",
        "flood",
        "fire",
    ]
    vulnerable_time = ["night", "winter", "monsoon", "rainy season"]

    if any(k in t for k in urgent_keywords):
        score = 0.9
    elif any(k in t for k in ["no water", "no food", "no electricity", "blocking road"]):
        score = 0.8

    if any(k in t for k in vulnerable_time):
        score = min(1.0, score + 0.1)

    return max(0.0, min(1.0, score))


def compute_population_impact(db: Session, area: str | None, category: str | None) -> float:
    """
    Estimate population impact based on count of similar complaints
    in the same area and category.
    """
    if not area or not category:
        return 0.3

    count = (
        db.query(Complaint)
        .filter(
            Complaint.area == area,
            Complaint.category == category,
        )
        .count()
    )

    # Map count to [0.2, 1.0] with a saturation
    if count == 0:
        return 0.2
    if count == 1:
        return 0.4
    if count <= 5:
        return 0.6
    if count <= 20:
        return 0.8
    return 1.0


def compute_vulnerability(text: str) -> float:
    """
    Heuristic vulnerability score [0, 1] based on mention of groups.
    """
    t = (text or "").lower()
    score = 0.3

    high_vulnerability = [
        "pregnant",
        "disabled",
        "divyang",
        "old age",
        "senior citizen",
        "orphan",
        "widow",
    ]
    medium_vulnerability = ["child", "children", "slum", "migrant", "daily wage"]

    if any(k in t for k in high_vulnerability):
        score = 0.9
    elif any(k in t for k in medium_vulnerability):
        score = 0.7

    return max(0.0, min(1.0, score))


def compute_priority_score(
    urgency: float,
    population_impact: float,
    vulnerability: float,
    model_confidence: float,
) -> float:
    """
    Aggregate a final priority score [0, 1].

    Weights are configurable; here chosen for explainability.
    """
    w_urgency = 0.35
    w_population = 0.25
    w_vulnerability = 0.25
    w_confidence = 0.15

    score = (
        w_urgency * urgency
        + w_population * population_impact
        + w_vulnerability * vulnerability
        + w_confidence * model_confidence
    )
    return max(0.0, min(1.0, score))


def evaluate_complaint(
    db: Session,
    text: str,
    area: str | None,
    category: str,
    confidence: float,
) -> Tuple[float, float, float, float]:
    """
    Run the full priority pipeline and return:
    (urgency, population_impact, vulnerability, priority_score)
    """
    urgency = compute_urgency(text)
    population_impact = compute_population_impact(db, area=area, category=category)
    vulnerability = compute_vulnerability(text)
    priority_score = compute_priority_score(
        urgency=urgency,
        population_impact=population_impact,
        vulnerability=vulnerability,
        model_confidence=confidence,
    )

    return urgency, population_impact, vulnerability, priority_score

