from sqlalchemy.orm import Session
from typing import Optional, List
from decimal import Decimal
from app.models.order import Order, OrderItem
from app.models.menu import MenuItem
from app.schemas.v1.order import OrderCreate, OrderUpdate, OrderItemCreate


class OrderRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, order_id: int) -> Optional[Order]:
        return self.db.query(Order).filter(Order.id == order_id).first()

    def get_by_id_with_items(self, order_id: int) -> Optional[Order]:
        return (
            self.db.query(Order)
            .filter(Order.id == order_id)
            .first()
        )

    def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        status: Optional[str] = None,
    ) -> List[Order]:
        query = self.db.query(Order)
        if status:
            query = query.filter(Order.status == status)
        return query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()

    def create(self, order_data: OrderCreate) -> Order:
        db_order = Order(
            table_number=order_data.table_number,
            customer_name=order_data.customer_name,
            status="pending",
            total=Decimal("0.00"),
        )
        self.db.add(db_order)
        self.db.flush()

        total = Decimal("0.00")
        for item_data in order_data.items:
            menu_item = self.db.query(MenuItem).filter(MenuItem.id == item_data.menu_item_id).first()
            if not menu_item:
                raise ValueError(f"Menu item {item_data.menu_item_id} not found")

            order_item = OrderItem(
                order_id=db_order.id,
                menu_item_id=item_data.menu_item_id,
                quantity=item_data.quantity,
                unit_price=menu_item.price,
                subtotal=menu_item.price * item_data.quantity,
            )
            self.db.add(order_item)
            total += order_item.subtotal

        db_order.total = total
        self.db.commit()
        self.db.refresh(db_order)
        return db_order

    def update(self, order_id: int, order_data: OrderUpdate) -> Optional[Order]:
        order = self.get_by_id(order_id)
        if not order:
            return None
        update_data = order_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(order, key, value)
        self.db.commit()
        self.db.refresh(order)
        return order

    def update_status(self, order_id: int, status: str) -> Optional[Order]:
        order = self.get_by_id(order_id)
        if not order:
            return None
        order.status = status
        self.db.commit()
        self.db.refresh(order)
        return order

    def delete(self, order_id: int) -> bool:
        order = self.get_by_id(order_id)
        if not order:
            return False
        self.db.query(OrderItem).filter(OrderItem.order_id == order_id).delete()
        self.db.delete(order)
        self.db.commit()
        return True
