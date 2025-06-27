"""fix user role case to match enum

Revision ID: 7abdbc38398d
Revises: 931cd2c57972
Create Date: 2025-06-25 22:18:28.535250

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7abdbc38398d'
down_revision: Union[str, Sequence[str], None] = '931cd2c57972'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
