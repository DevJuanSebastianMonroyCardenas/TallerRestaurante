from fastapi import APIRouter

router = APIRouter()


@router.get("/billing")
def list_billing():
    return {"invoices": []}
