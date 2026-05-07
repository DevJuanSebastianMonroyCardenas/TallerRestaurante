from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from app.core.database import Base


class Table(Base):
    __tablename__ = "tables"

    id = Column(Integer, primary_key=True, index=True)
    table_number = Column(Integer, unique=True, nullable=False)
    capacity = Column(Integer, default=4)
    is_available = Column(Boolean, default=True)


class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(100), nullable=False)
    customer_phone = Column(String(20))
    customer_email = Column(String(100))
    table_id = Column(Integer)
    reservation_date = Column(DateTime, nullable=False)
    duration_minutes = Column(Integer, default=120)
    status = Column(String(20), default="confirmed")
    notes = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
