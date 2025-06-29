"""add_audiences_field_to_campaigns

Revision ID: 64fa4fcc4dbb
Revises: 7abdbc38398d
Create Date: 2025-06-27 21:30:00.995299

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '64fa4fcc4dbb'
down_revision: Union[str, Sequence[str], None] = '7abdbc38398d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Only add the audiences column
    op.add_column('campaigns', sa.Column('audiences', sa.JSON(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    # Only drop the audiences column
    op.drop_column('campaigns', 'audiences')
