import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status
from app.models.team_membership import TeamMembership
from app.models.user import User
from app.models.role import Role
from app.schemas.team_membership import TeamMembershipCreate

async def add_team_member(db: AsyncSession, membership_in: TeamMembershipCreate) -> TeamMembership:
    # Check for duplicate membership
    result = await db.execute(select(TeamMembership).filter(TeamMembership.user_id == membership_in.user_id, TeamMembership.company_id == membership_in.company_id))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="User is already a team member.")
    membership = TeamMembership(
        user_id=membership_in.user_id,
        company_id=membership_in.company_id,
        role_id=membership_in.role_id,
    )
    db.add(membership)
    await db.commit()
    await db.refresh(membership)
    return membership

async def remove_team_member(db: AsyncSession, membership_id: uuid.UUID) -> None:
    result = await db.execute(select(TeamMembership).filter(TeamMembership.id == membership_id))
    membership = result.scalars().first()
    if not membership:
        raise HTTPException(status_code=404, detail="Team membership not found.")
    await db.delete(membership)
    await db.commit()

async def change_team_member_role(db: AsyncSession, membership_id: uuid.UUID, new_role_id: uuid.UUID) -> TeamMembership:
    result = await db.execute(select(TeamMembership).filter(TeamMembership.id == membership_id))
    membership = result.scalars().first()
    if not membership:
        raise HTTPException(status_code=404, detail="Team membership not found.")
    membership.role_id = new_role_id
    db.add(membership)
    await db.commit()
    await db.refresh(membership)
    return membership

async def list_team_members(db: AsyncSession, company_id: uuid.UUID) -> list[TeamMembership]:
    result = await db.execute(select(TeamMembership).filter(TeamMembership.company_id == company_id))
    return result.scalars().all() 