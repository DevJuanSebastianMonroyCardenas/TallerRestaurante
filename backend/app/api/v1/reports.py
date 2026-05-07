from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db
from app.schemas.v1.reports import SalesReport, PopularItemsReport, CategorySalesReport
from app.services.reports import ReportService

router = APIRouter()


@router.get("/reports/sales", response_model=SalesReport)
def get_sales_report(
    start_date: datetime = Query(...),
    end_date: datetime = Query(...),
    db: Session = Depends(get_db),
):
    service = ReportService(db)
    return service.get_sales_report(start_date, end_date)


@router.get("/reports/popular-items", response_model=PopularItemsReport)
def get_popular_items_report(
    start_date: datetime = Query(...),
    end_date: datetime = Query(...),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    service = ReportService(db)
    return service.get_popular_items_report(start_date, end_date, limit)


@router.get("/reports/category-sales", response_model=CategorySalesReport)
def get_category_sales_report(
    start_date: datetime = Query(...),
    end_date: datetime = Query(...),
    db: Session = Depends(get_db),
):
    service = ReportService(db)
    return service.get_category_sales_report(start_date, end_date)
