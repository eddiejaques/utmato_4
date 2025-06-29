import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.future import select
from app.models.company import Company
import os
from app.db import base

from dotenv import load_dotenv
load_dotenv()

# --- Default Interests and Audiences (from task_005) ---
DEFAULT_INTERESTS = [
    "Fitness & Wellness", "Hiking", "Gardening", "Cooking", "Technology & Gadgets", "Travel", "Fashion & Style", "Home Improvement", "Photography", "Music", "Sports", "Reading & Books", "Gaming", "Art & Design", "Parenting", "Finance & Investing", "Food & Dining", "Cars & Automotive", "Pets & Animals", "Movies & TV", "Yoga", "Meditation", "Cycling", "Running", "Swimming", "Camping", "Fishing", "Bird Watching", "Baking", "Crafting", "Collecting", "Dancing", "Theater", "Science & Nature", "Astronomy", "History", "Politics", "Volunteering", "Languages", "Board Games", "Puzzles", "Shopping", "Beauty & Skincare", "Jewelry", "Weddings", "Real Estate", "Investing", "Startups", "E-sports", "Podcasts", "Blogging", "Social Media"
]

DEFAULT_AUDIENCES = [
    "Shoppers", "Frequent Travelers", "Movie Goers", "Students", "Parents", "Business Professionals", "Homeowners", "Fitness Enthusiasts", "Tech Enthusiasts", "Outdoor Adventurers", "Pet Owners", "Retirees", "First-time Buyers", "Event Attendees", "Online Learners", "Gamers", "DIYers", "Foodies", "Commuters", "Social Media Influencers", "Entrepreneurs", "Remote Workers", "College Graduates", "High School Students", "Expecting Parents", "Newlyweds", "Empty Nesters", "Small Business Owners", "Nonprofit Volunteers", "Healthcare Workers", "Teachers", "Artists", "Musicians", "Sports Fans", "Car Enthusiasts", "Investors", "Real Estate Agents", "Job Seekers", "Freelancers", "Digital Nomads", "Fashionistas", "Beauty Gurus", "Bargain Hunters", "Luxury Shoppers", "Environmentalists", "Political Activists", "Science Buffs", "Book Lovers", "Podcast Listeners", "Streaming Subscribers", "App Users"
]

# --- Database URL ---
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/postgres")

engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def populate_defaults():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Company))
        companies = result.scalars().all()
        updated = 0
        for company in companies:
            settings = company.settings or {}
            needs_update = False
            if not settings.get("default_interests"):
                settings["default_interests"] = DEFAULT_INTERESTS
                needs_update = True
            if not settings.get("default_audiences"):
                settings["default_audiences"] = DEFAULT_AUDIENCES
                needs_update = True
            if needs_update:
                company.settings = settings
                updated += 1
        if updated:
            await session.commit()
        print(f"Updated {updated} companies with default interests/audiences.")

if __name__ == "__main__":
    asyncio.run(populate_defaults()) 