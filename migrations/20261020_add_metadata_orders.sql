-- Zero-downtime migration for high-scale PostgreSQL database
-- Step 1: Add JSONB metadata column with instantaneous default assignment (PostgreSQL 11+)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Step 2: Create composite index concurrently without table lock
-- Note: Must be executed outside an explicit transaction block
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user_created 
ON orders (user_id, created_at DESC);
