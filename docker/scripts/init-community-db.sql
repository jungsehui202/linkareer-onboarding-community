-- 링커리어 커뮤니티 온보딩 과제 DB 초기화

-- 1. 확장 기능 설치
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. 전문 검색을 위한 pg_trgm 설치 (유사도 검색)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 3. 초기화 완료 로그
SELECT 'Database initialized successfully!' as status;
SELECT 'Extensions installed:' as info;
SELECT extname FROM pg_extension WHERE extname IN ('uuid-ossp', 'pg_trgm');
