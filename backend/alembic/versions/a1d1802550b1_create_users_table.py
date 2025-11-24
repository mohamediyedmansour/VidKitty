"""create users table

Revision ID: a1d1802550b1
Revises: 
Create Date: 2025-11-23 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'a1d1802550b1'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('email', sa.String(length=255), nullable=False, unique=True, index=True),
        sa.Column('password', sa.String(length=255), nullable=False)
    )


def downgrade() -> None:
    op.drop_table('users')
