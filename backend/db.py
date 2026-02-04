import os
from datetime import datetime
from typing import Generator

from dotenv import load_dotenv
from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    create_engine,
    func,
)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker, Session


load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./civisense.db")

# For SQLite, needed for multithreading in FastAPI
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    category = Column(String(100), index=True)
    confidence = Column(Float)
    urgency = Column(Float)
    population_impact = Column(Float)
    vulnerability = Column(Float)
    priority_score = Column(Float, index=True)
    scheme = Column(String(150))
    area = Column(String(150), index=True)
    status = Column(String(50), default="new", index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, server_default=func.now())

    feedback = relationship("Feedback", back_populates="complaint", cascade="all, delete-orphan")


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False)
    correct_category = Column(String(100), nullable=True)
    correct_scheme = Column(String(150), nullable=True)
    notes = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, server_default=func.now())

    complaint = relationship("Complaint", back_populates="feedback")


def create_all() -> None:
    """Create database tables."""
    Base.metadata.create_all(bind=engine)


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

