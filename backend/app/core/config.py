from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    CLERK_SECRET_KEY: str

    class Config:
        env_file = ".env"
        extra = 'ignore'

settings = Settings() 