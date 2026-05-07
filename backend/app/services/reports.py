from sqlalchemy.orm import Session
from sqlalchemy import func, select
from datetime import datetime, timedelta
from typing import List
from decimal import Decimal
from app.models.order import Order, OrderItem
from app.models.menu import MenuItem, Category
from app.models.billing import Invoice
from app.schemas.v1.reports import (
    SalesReport, SalesSummary, DailySales,
    PopularItemsReport, TopItem,
    CategorySalesReport, CategorySales,
)


class ReportService:
    def __init__(self, db: Session):
        self.db = db

    def get_sales_report(self, start_date: datetime, end_date: datetime) -> SalesReport:
        orders = (
            self.db.query(Order)
            .filter(Order.created_at >= start_date)
            .filter(Order.created_at <= end_date)
            .filter(Order.status == "delivered")
            .all()
        )

        total_orders = len(orders)
        total_revenue = sum((o.total for o in orders), Decimal("0.00"))
        total_tax = total_revenue * Decimal("0.10")
        average_order = total_revenue / total_orders if total_orders > 0 else Decimal("0.00")

        summary = SalesSummary(
            total_orders=total_orders,
            total_revenue=total_revenue,
            total_tax=total_tax,
            average_order=average_order,
        )

        daily_sales = []
        current_date = start_date.date()
        end = end_date.date()

        while current_date <= end:
            day_start = datetime.combine(current_date, datetime.min.time())
            day_end = datetime.combine(current_date, datetime.max.time())

            day_orders = [
                o for o in orders
                if day_start <= o.created_at <= day_end
            ]

            daily_sales.append(DailySales(
                date=day_start,
                orders_count=len(day_orders),
                revenue=sum((o.total for o in day_orders), Decimal("0.00")),
            ))

            current_date += timedelta(days=1)

        return SalesReport(
            start_date=start_date,
            end_date=end_date,
            summary=summary,
            daily_sales=daily_sales,
        )

    def get_popular_items_report(
        self,
        start_date: datetime,
        end_date: datetime,
        limit: int = 10,
    ) -> PopularItemsReport:
        results = (
            self.db.query(
                MenuItem.id.label("menu_item_id"),
                MenuItem.name.label("menu_item_name"),
                func.sum(OrderItem.quantity).label("quantity_sold"),
                func.sum(OrderItem.subtotal).label("revenue"),
            )
            .join(OrderItem, OrderItem.menu_item_id == MenuItem.id)
            .join(Order, Order.id == OrderItem.order_id)
            .filter(Order.created_at >= start_date)
            .filter(Order.created_at <= end_date)
            .filter(Order.status == "delivered")
            .group_by(MenuItem.id, MenuItem.name)
            .order_by(func.sum(OrderItem.quantity).desc())
            .limit(limit)
            .all()
        )

        top_items = [
            TopItem(
                menu_item_id=r.menu_item_id,
                menu_item_name=r.menu_item_name,
                quantity_sold=int(r.quantity_sold or 0),
                revenue=r.revenue or Decimal("0.00"),
            )
            for r in results
        ]

        return PopularItemsReport(
            start_date=start_date,
            end_date=end_date,
            top_items=top_items,
        )

    def get_category_sales_report(
        self,
        start_date: datetime,
        end_date: datetime,
    ) -> CategorySalesReport:
        results = (
            self.db.query(
                Category.id.label("category_id"),
                Category.name.label("category_name"),
                func.sum(OrderItem.quantity).label("items_sold"),
                func.sum(OrderItem.subtotal).label("revenue"),
            )
            .join(MenuItem, MenuItem.category_id == Category.id)
            .join(OrderItem, OrderItem.menu_item_id == MenuItem.id)
            .join(Order, Order.id == OrderItem.order_id)
            .filter(Order.created_at >= start_date)
            .filter(Order.created_at <= end_date)
            .filter(Order.status == "delivered")
            .group_by(Category.id, Category.name)
            .order_by(func.sum(OrderItem.subtotal).desc())
            .all()
        )

        categories = [
            CategorySales(
                category_id=r.category_id,
                category_name=r.category_name,
                items_sold=int(r.items_sold or 0),
                revenue=r.revenue or Decimal("0.00"),
            )
            for r in results
        ]

        return CategorySalesReport(
            start_date=start_date,
            end_date=end_date,
            categories=categories,
        )
