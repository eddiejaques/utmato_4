import uuid
import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status
from app.models.invitation import Invitation
from app.models.company import Company
from app.schemas.enums import InviteStatus, UserRole
from app.schemas.invitation import InvitationCreate, InvitationAcceptRequest, InvitationRejectRequest
from app.core.config import settings

async def generate_invitation_token() -> str:
    return str(uuid.uuid4())

async def create_invitation(db: AsyncSession, invitation_in: InvitationCreate) -> Invitation:
    # Check for duplicate invite
    result = await db.execute(select(Invitation).filter(Invitation.email == invitation_in.email, Invitation.company_id == invitation_in.company_id, Invitation.status == InviteStatus.PENDING))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Pending invitation already exists for this email.")
    token = await generate_invitation_token()
    invitation = Invitation(
        email=invitation_in.email,
        role=invitation_in.role,
        status=InviteStatus.PENDING,
        token=token,
        company_id=invitation_in.company_id,
    )
    db.add(invitation)
    await db.commit()
    await db.refresh(invitation)
    return invitation

async def get_invitation_by_token(db: AsyncSession, token: str) -> Invitation:
    result = await db.execute(select(Invitation).filter(Invitation.token == token))
    invitation = result.scalars().first()
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found.")
    return invitation

async def accept_invitation(db: AsyncSession, accept_in: InvitationAcceptRequest) -> Invitation:
    invitation = await get_invitation_by_token(db, accept_in.token)
    if invitation.status != InviteStatus.PENDING:
        raise HTTPException(status_code=400, detail="Invitation is not pending.")
    # Call Clerk API to create user and set password
    clerk_api_url = f"{settings.CLERK_ISSUER_URL}/v1/users"
    headers = {"Authorization": f"Bearer {settings.CLERK_SECRET_KEY}", "Content-Type": "application/json"}
    payload = {
        "email_address": invitation.email,
        "password": accept_in.password,
        "first_name": accept_in.first_name,
        "last_name": accept_in.last_name,
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(clerk_api_url, json=payload, headers=headers)
        if response.status_code not in (200, 201):
            raise HTTPException(status_code=502, detail=f"Clerk user creation failed: {response.text}")
    # Mark invitation as accepted
    invitation.status = InviteStatus.ACCEPTED
    await db.commit()
    await db.refresh(invitation)
    return invitation

async def reject_invitation(db: AsyncSession, reject_in: InvitationRejectRequest) -> Invitation:
    invitation = await get_invitation_by_token(db, reject_in.token)
    if invitation.status != InviteStatus.PENDING:
        raise HTTPException(status_code=400, detail="Invitation is not pending.")
    invitation.status = InviteStatus.REJECTED
    await db.commit()
    await db.refresh(invitation)
    return invitation

async def list_invitations(db: AsyncSession, company_id) -> list[Invitation]:
    result = await db.execute(select(Invitation).filter(Invitation.company_id == company_id))
    return result.scalars().all() 