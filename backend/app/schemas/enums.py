import enum

class UserRole(str, enum.Enum):
    MANAGER = "manager"
    MEMBER = "member"
    VIEWER = "viewer"

class CampaignStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    ARCHIVED = "archived" 