-- 1. 혹시 모르니 기존 인덱스를 먼저 확실히 지웁니다.
DROP INDEX IF EXISTS unique_email_when_active;
DROP INDEX IF EXISTS users_email_key;

-- 2. 그다음 인덱스를 생성합니다.
CREATE UNIQUE INDEX unique_email_when_active
ON users (email)
WHERE is_deleted = false;
