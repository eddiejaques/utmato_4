from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models.user import User
from app.models.company import Company
from app.schemas.clerk import ClerkUserData, ClerkDeletedUserData
from app.schemas.enums import UserRole
from app.schemas.user import UserSyncRequest

async def get_company_by_domain(db: AsyncSession, domain: str) -> Company | None:
    result = await db.execute(select(Company).filter(Company.domain == domain))
    return result.scalars().first()

async def create_company(db: AsyncSession, domain: str) -> Company:
    company_name = domain.split('.')[0].capitalize()
    
    # Check if a company with this name already exists
    existing_company = await db.execute(select(Company).filter(Company.name == company_name))
    if existing_company.scalars().first():
        # If name is taken, create a variation
        import uuid
        company_name = f"{company_name}-{str(uuid.uuid4())[:4]}"

    new_company = Company(name=company_name, domain=domain)
    db.add(new_company)
    await db.commit()
    await db.refresh(new_company)
    return new_company

async def handle_user_created(db: AsyncSession, user_data: ClerkUserData):
    email = user_data.email_addresses[0].email_address
    domain = email.split('@')[1]

    company = await get_company_by_domain(db, domain)
    if not company:
        company = await create_company(db, domain)

    new_user = User(
        clerk_id=user_data.id,
        email=email,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        image_url=user_data.image_url,
        company_id=company.id,
        role=UserRole.MANAGER, 
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

async def handle_user_updated(db: AsyncSession, user_data: ClerkUserData):
    user = (await db.execute(select(User).filter(User.clerk_id == user_data.id))).scalars().first()
    if user:
        user.first_name = user_data.first_name
        user.last_name = user_data.last_name
        user.image_url = user_data.image_url
        if user_data.email_addresses:
            user.email = user_data.email_addresses[0].email_address
        await db.commit()
        await db.refresh(user)
    return user

async def handle_user_deleted(db: AsyncSession, user_data: ClerkDeletedUserData):
    user = (await db.execute(select(User).filter(User.clerk_id == user_data.id))).scalars().first()
    if user:
        await db.delete(user)
        await db.commit()
    return {"status": "deleted", "clerk_id": user_data.id}

async def get_user_by_clerk_id(db: AsyncSession, clerk_id: str) -> User | None:
    result = await db.execute(select(User).filter(User.clerk_id == clerk_id))
    return result.scalars().first()

async def find_or_create_user_with_company(db: AsyncSession, user_data: UserSyncRequest) -> tuple[User, Company | None]:
    """
    Finds a user by Clerk ID or creates a new one,
    also finding or creating the associated company based on email domain.
    """
    existing_user = await db.execute(
        select(User)
        .options(selectinload(User.company))
        .filter(User.clerk_id == user_data.clerk_id)
    )
    user = existing_user.scalars().first()

    if user:
        # Optionally update user fields here if they can change
        return user, user.company

    # User does not exist, create them
    email_domain = user_data.email.split('@')[1]
    
    # Find or create company
    existing_company = await db.execute(
        select(Company).filter(Company.domain == email_domain)
    )
    company = existing_company.scalars().first()

    if not company:
        company = Company(
            name=email_domain.split('.')[0].capitalize(),
            domain=email_domain
        )
        db.add(company)
        await db.flush() # Flush to get company.id

    # Create new user
    new_user = User(
        clerk_id=user_data.clerk_id,
        email=user_data.email,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        company_id=company.id,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    await db.refresh(company)

    return new_user, company 