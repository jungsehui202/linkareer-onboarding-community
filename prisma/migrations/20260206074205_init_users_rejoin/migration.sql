-- DropIndex
DROP INDEX "users_email_idx";

-- 활성 사용자만 email unique
CREATE UNIQUE INDEX users_email_active_unique
ON users(email)
WHERE is_deleted = false;
