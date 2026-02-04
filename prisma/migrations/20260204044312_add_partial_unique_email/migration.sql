-- 기존 unique 제약 제거 (이미 schema.prisma에서 제거됨)
DROP INDEX IF EXISTS users_email_key;

-- Partial Index 생성: is_deleted = false인 행만 유니크
CREATE UNIQUE INDEX IF NOT EXISTS unique_email_when_active
ON users (email)
WHERE is_deleted = false;
