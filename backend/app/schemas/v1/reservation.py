from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class TableBase(BaseModel):
    table_number: int
    capacity: int = 4


class TableCreate(TableBase):
    pass


class TableUpdate(BaseModel):
    capacity: Optional[int] = None
    is_available: Optional[bool] = None


class TableResponse(TableBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_available: bool


class ReservationBase(BaseModel):
    customer_name: str
    customer_phone: Optional[str] = None
    customer_email: Optional[str] = None
    table_id: Optional[int] = None
    reservation_date: datetime
    duration_minutes: int = 120
    notes: Optional[str] = None


class ReservationCreate(ReservationBase):
    pass


class ReservationUpdate(BaseModel):
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    customer_email: Optional[str] = None
    table_id: Optional[int] = None
    reservation_date: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class ReservationResponse(ReservationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    created_at: datetime
