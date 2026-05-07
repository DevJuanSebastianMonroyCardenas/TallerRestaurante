from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List
from decimal import Decimal


class OrderItemBase(BaseModel):
    menu_item_id: int
    quantity: int = 1


class OrderItemCreate(OrderItemBase):
    pass


class OrderItemUpdate(BaseModel):
    quantity: Optional[int] = None


class OrderItemResponse(OrderItemBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_id: int
    unit_price: Decimal
    subtotal: Decimal


class OrderBase(BaseModel):
    table_number: int
    customer_name: Optional[str] = None


class OrderCreate(OrderBase):
    items: List[OrderItemCreate]


class OrderUpdate(BaseModel):
    table_number: Optional[int] = None
    customer_name: Optional[str] = None
    status: Optional[str] = None


class OrderResponse(OrderBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    total: Decimal
    created_at: datetime
    updated_at: datetime


class OrderWithItems(OrderResponse):
    items: List[OrderItemResponse] = []
