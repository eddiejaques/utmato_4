"""Add performance indexes for campaigns and utm_links

Revision ID: xxxxxxxxxxxx
Revises: 3776d0cb873f
Create Date: 2025-06-22 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'xxxxxxxxxxxx'
down_revision: Union[str, Sequence[str], None] = '3776d0cb873f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    """Upgrade schema."""
    # B-tree index for campaign status
    op.create_index('idx_campaigns_status', 'campaigns', ['status'])
    # B-tree index for utm_links.generated_url
    op.create_index('idx_utm_links_generated_url', 'utm_links', ['generated_url'])
    # GIN index for full-text search on campaigns (name, demographics, interests)
    op.execute("""
        CREATE INDEX idx_campaigns_fulltext_gin ON campaigns USING GIN (
            to_tsvector('english', coalesce(name, '') || ' ' || coalesce(demographics, '') || ' ' || coalesce(interests, ''))
        )
    """)
    # GIN index for full-text search on utm_links (source, medium, content)
    op.execute("""
        CREATE INDEX idx_utm_links_fulltext_gin ON utm_links USING GIN (
            to_tsvector('english', coalesce(utm_source, '') || ' ' || coalesce(utm_medium, '') || ' ' || coalesce(utm_content, ''))
        )
    """)

def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index('idx_campaigns_status', table_name='campaigns')
    op.drop_index('idx_utm_links_generated_url', table_name='utm_links')
    op.execute('DROP INDEX IF EXISTS idx_campaigns_fulltext_gin')
    op.execute('DROP INDEX IF EXISTS idx_utm_links_fulltext_gin') 