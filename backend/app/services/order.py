from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.order import Order
from app.schemas.v1.order import OrderCreate, OrderUpdate
from app.repositories.order import OrderRepository


class OrderService:
    STATUS_VALUES = ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"]

    def __init__(self, db: Session):
        self.repository = OrderRepository(db)

    def get_by_id(self, order_id: int) -> Optional[Order]:
        return self.repository.get_by_id(order_id)

    def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        status: Optional[str] = None,
    ) -> List[Order]:
        if status and status not in self.STATUS_VALUES:
            raise ValueError(f"Invalid status. Must be one of: {self.STATUS_VALUES}")
        return self.repository.get_all(skip, limit, status)

    def create(self, order_data: OrderCreate) -> Order:
        return self.repository.create(order_data)

    def update(self, order_id: int, order_data: OrderUpdate) -> Optional[Order]:
        return self.repository.update(order_id, order_data)

    def update_status(self, order_id: int, status: str) -> Optional[Order]:
        if status not in self.STATUS_VALUES:
            raise ValueError(f"Invalid status. Must be one of: {self.STATUS_VALUES}")
        return self.repository.update_status(order_id, status)

    def cancel_order(self, order_id: int) -> Optional[Order]:
        return self.repository.update_status(order_id, "cancelled")

    def delete(self, order_id: int) -> bool:
        return self.repository.delete(order_id)
