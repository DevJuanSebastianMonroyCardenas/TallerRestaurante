from pydantic import BaseModel
from datetime import datetime
from typing import List
from decimal import Decimal


class SalesSummary(BaseModel):
    total_orders: int
    total_revenue: Decimal
    total_tax: Decimal
    average_order: Decimal


class DailySales(BaseModel):
    date: datetime
    orders_count: int
    revenue: Decimal


class SalesReport(BaseModel):
    start_date: datetime
    end_date: datetime
    summary: SalesSummary
    daily_sales: List[DailySales]


class TopItem(BaseModel):
    menu_item_id: int
    menu_item_name: str
    quantity_sold: int
    revenue: Decimal


class PopularItemsReport(BaseModel):
    start_date: datetime
    end_date: datetime
    top_items: List[TopItem]


class CategorySales(BaseModel):
    category_id: int
    category_name: str
    items_sold: int
    revenue: Decimal


class CategorySalesReport(BaseModel):
    start_date: datetime
    end_date: datetime
    categories: List[CategorySales]
