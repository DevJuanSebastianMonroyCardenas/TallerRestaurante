from datetime import datetime, timedelta
from decimal import Decimal

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.billing import Invoice, Payment
from app.models.menu import Category, MenuItem
from app.models.order import Order, OrderItem
from app.models.reservation import Reservation, Table
from app.models.user import User


def seed_demo_data(db: Session) -> None:
    existing_categories = db.query(Category).count()
    existing_items = db.query(MenuItem).count()
    if existing_categories > 0 and existing_items > 0:
        return

    admin = User(
        username="admin",
        email="admin@restaurant.com",
        hashed_password=hash_password("secret"),
        full_name="Administrador General",
        role="admin",
        is_active=1,
    )
    waiter = User(
        username="mesero1",
        email="mesero1@restaurant.com",
        hashed_password=hash_password("secret"),
        full_name="Lucia Torres",
        role="user",
        is_active=1,
    )
    if db.query(User).count() == 0:
        db.add_all([admin, waiter])
        db.flush()

    categories = [
        Category(name="Entradas", description="Piqueos y entradas ligeras", is_active=True),
        Category(name="Fondos", description="Platos principales", is_active=True),
        Category(name="Bebidas", description="Bebidas frías y calientes", is_active=True),
        Category(name="Postres", description="Postres caseros", is_active=True),
    ]
    db.add_all(categories)
    db.flush()

    menu_items = [
        MenuItem(name="Causa Limeña", description="Papa amarilla y pollo", price=Decimal("18.00"), category_id=categories[0].id, is_available=True),
        MenuItem(name="Tequeños", description="Con salsa huancaína", price=Decimal("16.00"), category_id=categories[0].id, is_available=True),
        MenuItem(name="Lomo Saltado", description="Lomo, papas y arroz", price=Decimal("32.00"), category_id=categories[1].id, is_available=True),
        MenuItem(name="Arroz Chaufa", description="Pollo, huevo y sillao", price=Decimal("28.00"), category_id=categories[1].id, is_available=True),
        MenuItem(name="Chicha Morada", description="Vaso 16oz", price=Decimal("8.00"), category_id=categories[2].id, is_available=True),
        MenuItem(name="Limonada", description="Limonada fresca", price=Decimal("7.50"), category_id=categories[2].id, is_available=True),
        MenuItem(name="Suspiro Limeño", description="Postre tradicional", price=Decimal("14.00"), category_id=categories[3].id, is_available=True),
    ]
    db.add_all(menu_items)
    db.flush()

    tables = [
        Table(table_number=1, capacity=2, is_available=True),
        Table(table_number=2, capacity=4, is_available=True),
        Table(table_number=3, capacity=4, is_available=False),
        Table(table_number=4, capacity=6, is_available=True),
        Table(table_number=5, capacity=8, is_available=True),
    ]
    db.add_all(tables)
    db.flush()

    order_1 = Order(table_number=3, customer_name="Carlos Rojas", status="delivered", total=Decimal("72.00"))
    order_2 = Order(table_number=2, customer_name="Mariana Solis", status="preparing", total=Decimal("44.00"))
    db.add_all([order_1, order_2])
    db.flush()

    order_items = [
        OrderItem(order_id=order_1.id, menu_item_id=menu_items[2].id, quantity=2, unit_price=Decimal("32.00"), subtotal=Decimal("64.00")),
        OrderItem(order_id=order_1.id, menu_item_id=menu_items[4].id, quantity=1, unit_price=Decimal("8.00"), subtotal=Decimal("8.00")),
        OrderItem(order_id=order_2.id, menu_item_id=menu_items[3].id, quantity=1, unit_price=Decimal("28.00"), subtotal=Decimal("28.00")),
        OrderItem(order_id=order_2.id, menu_item_id=menu_items[6].id, quantity=1, unit_price=Decimal("14.00"), subtotal=Decimal("14.00")),
        OrderItem(order_id=order_2.id, menu_item_id=menu_items[5].id, quantity=1, unit_price=Decimal("7.50"), subtotal=Decimal("7.50")),
    ]
    db.add_all(order_items)

    reservation_1 = Reservation(
        customer_name="Andrea Pineda",
        customer_phone="+51 999 111 222",
        customer_email="andrea@email.com",
        table_id=tables[3].id,
        reservation_date=datetime.utcnow() + timedelta(hours=3),
        duration_minutes=120,
        status="confirmed",
        notes="Cumpleaños",
    )
    reservation_2 = Reservation(
        customer_name="Jorge Mena",
        customer_phone="+51 999 333 444",
        customer_email="jorge@email.com",
        table_id=tables[4].id,
        reservation_date=datetime.utcnow() + timedelta(days=1, hours=2),
        duration_minutes=90,
        status="confirmed",
        notes="Mesa tranquila",
    )
    db.add_all([reservation_1, reservation_2])
    db.flush()

    invoice = Invoice(
        invoice_number="INV-000001",
        order_id=order_1.id,
        subtotal=Decimal("72.00"),
        tax=Decimal("7.20"),
        total=Decimal("79.20"),
        payment_method="card",
        status="paid",
    )
    db.add(invoice)
    db.flush()

    payment = Payment(
        invoice_id=invoice.id,
        amount=Decimal("79.20"),
        payment_method="card",
        reference="TXN-2026-0001",
    )
    db.add(payment)

    db.commit()


def reset_demo_data(db: Session) -> None:
    db.query(Payment).delete()
    db.query(Invoice).delete()
    db.query(OrderItem).delete()
    db.query(Order).delete()
    db.query(Reservation).delete()
    db.query(Table).delete()
    db.query(MenuItem).delete()
    db.query(Category).delete()
    db.query(User).delete()
    db.commit()
    seed_demo_data(db)
