"""
Civisense NLP Engine
Single-file hackathon version (NO cross-file imports)
Exposes NLPEngine for FastAPI
"""

import re
import os
import joblib
from typing import Dict, Any, Tuple


# =========================
# INTERNAL AI ENGINE
# =========================

class CivisenseNLP:
    URGENCY_KEYWORDS = {
        "emergency": 0.3,
        "urgent": 0.25,
        "critical": 0.25,
        "immediately": 0.2,
        "life-threatening": 0.3,
        "dangerous": 0.25,
        "hazardous": 0.25,
        "severe": 0.2,
        "acute": 0.2,
        "collapsed": 0.25,
        "accident": 0.2,
        "broken": 0.15,
        "damaged": 0.15,
        "overflowing": 0.2,
        "flooding": 0.25,
        "outbreak": 0.25,
        "epidemic": 0.3,
        "no supply": 0.2,
        "not working": 0.15,
        "stopped": 0.2,
    }

    POPULATION_KEYWORDS = {
        "entire area": 0.3,
        "whole colony": 0.3,
        "complete ward": 0.3,
        "all residents": 0.3,
        "entire community": 0.3,
        "multiple streets": 0.25,
        "affecting": 0.15,
        "several households": 0.2,
        "multiple families": 0.2,
        "local residents": 0.15,
    }

    POPULATION_NUMBERS = [
        (r"\b(\d+)\+?\s*households?\b", 10),
        (r"\b(\d+)\+?\s*people\b", 5),
        (r"\b(\d+)\+?\s*families\b", 15),
    ]

    VULNERABILITY_KEYWORDS = {
        "senior citizens": 0.8,
        "elderly": 0.8,
        "old age": 0.8,
        "children": 0.7,
        "school children": 0.7,
        "kids": 0.7,
        "pregnant women": 0.9,
        "disabled": 0.9,
        "specially abled": 0.9,
        "widows": 0.8,
        "orphans": 0.8,
        "slum dwellers": 0.7,
        "tribal": 0.7,
        "sc/st": 0.7,
        "below poverty line": 0.8,
        "daily wage": 0.7,
        "bpl": 0.8,
    }

    TIME_PATTERNS = [
        (r"(\d+)\s*days?", "days"),
        (r"(\d+)\s*weeks?", "weeks"),
        (r"(\d+)\s*months?", "months"),
    ]

    def __init__(self, model_bundle: Dict):
        self.model = model_bundle

    # ---------- CATEGORY ----------

    def predict_category(self, text: str):
        X = self.model["vectorizer"].transform([text])
        prediction = self.model["classifier"].predict(X)[0]
        probabilities = self.model["classifier"].predict_proba(X)[0]

        all_probs = {
            cat: float(prob)
            for cat, prob in zip(self.model["categories"], probabilities)
        }

        confidence = float(probabilities.max())
        return prediction, confidence, all_probs

    # ---------- URGENCY ----------

    def calculate_urgency_score(self, text: str):
        t = text.lower()
        score = 0.3
        reasons = []

        for k, v in self.URGENCY_KEYWORDS.items():
            if k in t:
                score += v
                reasons.append(f"Urgency keyword '{k}' (+{v:.2f})")

        for pattern, unit in self.TIME_PATTERNS:
            matches = re.findall(pattern, t)
            if matches:
                d = int(matches[0])
                add = 0
                if unit == "days" and d >= 5:
                    add = min(0.15, d / 100)
                elif unit == "weeks" and d >= 2:
                    add = min(0.2, d / 30)
                elif unit == "months" and d >= 2:
                    add = min(0.25, d / 20)

                if add > 0:
                    score += add
                    reasons.append(f"Persisting {d} {unit} (+{add:.2f})")

        return round(min(score, 1.0), 2), reasons

    # ---------- POPULATION ----------

    def calculate_population_impact(self, text: str):
        t = text.lower()
        score = 0.2
        reasons = []

        for k, v in self.POPULATION_KEYWORDS.items():
            if k in t:
                score += v
                reasons.append(f"Population keyword '{k}' (+{v:.2f})")

        for pattern, multiplier in self.POPULATION_NUMBERS:
            matches = re.findall(pattern, t)
            if matches:
                count = int(matches[0])
                add = min(0.4, count / multiplier / 10)
                score += add
                reasons.append(f"Affects ~{count}+ people (+{add:.2f})")

        return round(min(score, 1.0), 2), reasons

    # ---------- VULNERABILITY ----------

    def calculate_vulnerability_score(self, text: str):
        t = text.lower()
        score = 0.0
        reasons = []

        for k, v in self.VULNERABILITY_KEYWORDS.items():
            if k in t:
                score = max(score, v)
                reasons.append(f"Vulnerable group '{k}' (score {v:.2f})")

        return round(score, 2), reasons

    # ---------- FULL PIPELINE ----------

    def analyze_complaint(self, text: str) -> Dict:
        category, confidence, _ = self.predict_category(text)

        urgency, urg_reasons = self.calculate_urgency_score(text)
        population, pop_reasons = self.calculate_population_impact(text)
        vulnerability, vul_reasons = self.calculate_vulnerability_score(text)

        priority = round(
            (0.4 * urgency) + (0.35 * population) + (0.25 * vulnerability), 3
        )

        if priority >= 0.7:
            level = "HIGH"
        elif priority >= 0.45:
            level = "MEDIUM"
        else:
            level = "LOW"

        return {
            "category": {
                "predicted": category,
                "confidence": confidence,
            },
            "scores": {
                "urgency": urgency,
                "population_impact": population,
                "vulnerability": vulnerability,
                "priority": priority,
                "priority_level": level,
            },
            "explanations": {
                "urgency": urg_reasons or ["Base urgency applied"],
                "population": pop_reasons or ["Single complaint"],
                "vulnerability": vul_reasons or ["No vulnerable groups"],
            },
        }


# =========================
# FASTAPI INTERFACE
# =========================

class NLPEngine:
    def __init__(self, model_path: str = "model.joblib"):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")

        model_bundle = joblib.load(model_path)
        self.engine = CivisenseNLP(model_bundle)

    def predict_category(self, text: str) -> Tuple[str, float]:
        result = self.engine.analyze_complaint(text)
        return (
            result["category"]["predicted"],
            float(result["category"]["confidence"]),
        )

    def analyze_full(self, text: str) -> Dict[str, Any]:
        return self.engine.analyze_complaint(text)
