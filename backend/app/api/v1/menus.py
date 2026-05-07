from fastapi import APIRouter

router = APIRouter()


@router.get("/menus")
def list_menus():
    return {"menus": []}
