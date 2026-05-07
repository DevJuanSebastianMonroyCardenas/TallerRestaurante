from sqlalchemy import Column, Integer, String, Numeric, Boolean, DateTime
from datetime import datetime
from app.core.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    description = Column(String(200))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(500))
    price = Column(Numeric(10, 2), nullable=False)
    category_id = Column(Integer)
    is_available = Column(Boolean, default=True)
    image_url = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
