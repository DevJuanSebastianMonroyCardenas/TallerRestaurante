from fastapi import APIRouter

router = APIRouter()


@router.get("/reservations")
def list_reservations():
    return {"reservations": []}
