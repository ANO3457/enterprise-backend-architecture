-- Drop traditional global unique constraint that breaks soft-deleted re-registration
DROP INDEX IF EXISTS idx_users_email_unique;

-- Create partial unique index only for active (non-deleted) accounts
-- This allows re-registering an email if the previous account was soft-deleted
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_active_unique 
ON users (email) 
WHERE deleted_at IS NULL;
