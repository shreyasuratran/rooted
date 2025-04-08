from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from typing import List
from models import User, Plant
from schemas import PlantBase, PlantResponse, PlantUpdate
from util.auth import get_current_user
from util.database import get_db
from datetime import datetime, timezone, timedelta

router = APIRouter()

@router.post("/")
async def create_plant(plant_data: PlantBase, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    plant = Plant(**plant_data.dict(), user_id=current_user.id)
    db.add(plant)
    await db.commit()
    await db.refresh(plant)
    return plant

@router.get("/all", response_model=List[PlantResponse])
async def get_all_plants(db: AsyncSession = Depends(get_db)):
    stmt = select(Plant)
    response = await db.execute(stmt)
    return response.scalars().all()

@router.get("/", response_model=List[PlantResponse])
async def get_plants(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(Plant).where(Plant.user_id == current_user.id).order_by(Plant.id)
    response = await db.execute(stmt)
    return response.scalars().all()

@router.get("/critical", response_model=List[PlantResponse])
async def get_plants(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(Plant).where(Plant.user_id == current_user.id, Plant.water <= 50).order_by(Plant.id)
    response = await db.execute(stmt)
    return response.scalars().all()

@router.get("/{plant_id}")
async def get_plant(plant_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(Plant).where(Plant.user_id == current_user.id, Plant.id == plant_id)
    response = await db.execute(stmt)
    plant = response.scalars().first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    return plant

@router.put("/{plant_id}")
async def update_plant(plant_id: int, plant_data: PlantUpdate, db: AsyncSession = Depends(get_db)):
    stmt = select(Plant).where(Plant.id == plant_id)
    response = await db.execute(stmt)
    plant = response.scalars().first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    

    utc_offset = timedelta(hours=-5)
    if plant_data.water is not None and plant.water is not None:
        if plant_data.water > plant.water:
            plant.last_watered = (datetime.now(timezone.utc) + utc_offset).replace(tzinfo=None)
    
    for key, value in plant_data.dict(exclude_unset=True).items():
        setattr(plant, key, value)

    await db.commit()
    await db.refresh(plant)
    return plant