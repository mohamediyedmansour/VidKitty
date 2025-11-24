"""add name column to users

Revision ID: 0001_add_user_name
Revises: 
Create Date: 2025-11-24 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0001_add_user_name'
down_revision = 'a1d1802550b1'
branch_labels = None
depends_on = None


def upgrade():
    # Add 'name' column with a temporary server_default to avoid issues on existing rows
    op.add_column('users', sa.Column('name', sa.String(length=255), nullable=False, server_default=''))
    # remove server default
    op.alter_column('users', 'name', server_default=None)


def downgrade():
    op.drop_column('users', 'name')
