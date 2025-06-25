import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status
from app.models.role import Role
from app.schemas.role import RoleCreate

async def create_role(db: AsyncSession, role_in: RoleCreate) -> Role:
    result = await db.execute(select(Role).filter(Role.name == role_in.name))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Role already exists.")
    role = Role(name=role_in.name)
    db.add(role)
    await db.commit()
    await db.refresh(role)
    return role

async def get_role_by_id(db: AsyncSession, role_id: uuid.UUID) -> Role:
    result = await db.execute(select(Role).filter(Role.id == role_id))
    role = result.scalars().first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found.")
    return role

async def list_roles(db: AsyncSession) -> list[Role]:
    result = await db.execute(select(Role))
    return result.scalars().all() 