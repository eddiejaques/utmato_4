from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies.db import get_db
from app.schemas.invitation import (
    InvitationCreate, InvitationResponse, InvitationAcceptRequest, InvitationRejectRequest, InvitationStatusResponse
)
from app.services import invitation_service
from app.schemas.enums import InviteStatus

router = APIRouter()

@router.post("/invite", response_model=InvitationResponse, status_code=status.HTTP_201_CREATED)
async def invite_user(invite_in: InvitationCreate, db: AsyncSession = Depends(get_db)):
    """Invite a new user to the company."""
    invitation = await invitation_service.create_invitation(db, invite_in)
    return invitation

@router.post("/accept", response_model=InvitationStatusResponse)
async def accept_invitation(accept_in: InvitationAcceptRequest, db: AsyncSession = Depends(get_db)):
    """Accept an invitation using the token."""
    invitation = await invitation_service.accept_invitation(db, accept_in)
    return InvitationStatusResponse(status=invitation.status, message="Invitation accepted.")

@router.post("/reject", response_model=InvitationStatusResponse)
async def reject_invitation(reject_in: InvitationRejectRequest, db: AsyncSession = Depends(get_db)):
    """Reject an invitation using the token."""
    invitation = await invitation_service.reject_invitation(db, reject_in)
    return InvitationStatusResponse(status=invitation.status, message="Invitation rejected.")

@router.get("/list/{company_id}", response_model=list[InvitationResponse])
async def list_invitations(company_id: str, db: AsyncSession = Depends(get_db)):
    """List all invitations for a company."""
    invitations = await invitation_service.list_invitations(db, company_id)
    return invitations

@router.get("/status/{token}", response_model=InvitationStatusResponse)
async def invitation_status(token: str, db: AsyncSession = Depends(get_db)):
    """Get the status of an invitation by token."""
    invitation = await invitation_service.get_invitation_by_token(db, token)
    return InvitationStatusResponse(status=invitation.status, message=f"Invitation status: {invitation.status}") 