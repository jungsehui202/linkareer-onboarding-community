-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "popularity_score" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "search_count" INTEGER NOT NULL DEFAULT 0;

-- 1. deletedAt 컬럼 추가 (Soft Delete)
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 2. Partial Index (BEST 게시판 전용)
CREATE INDEX IF NOT EXISTS idx_best_posts_optimized
ON posts (popularity_score DESC, view_count DESC, created_at DESC)
WHERE deleted_at IS NULL AND view_count >= 10;

-- 3. Full-Text Search GIN Index (제목 + 본문)
CREATE INDEX IF NOT EXISTS idx_posts_fts_combined
ON posts USING GIN (
  to_tsvector('simple', COALESCE(title, '') || ' ' || COALESCE(content, ''))
)
WHERE deleted_at IS NULL;

-- 4. Full-Text Search GIN Index (제목만 - 빠른 검색)
CREATE INDEX IF NOT EXISTS idx_posts_fts_title
ON posts USING GIN (to_tsvector('simple', title))
WHERE deleted_at IS NULL;

-- 5. Partial Index (deletedAt 제외 + viewCount)
CREATE INDEX IF NOT EXISTS idx_posts_active_views
ON posts (view_count DESC, created_at DESC)
WHERE deleted_at IS NULL;

-- 6. Partial Index (deletedAt 제외 + popularityScore)
CREATE INDEX IF NOT EXISTS idx_posts_active_popularity
ON posts (popularity_score DESC, created_at DESC)
WHERE deleted_at IS NULL;

-- 7. 기존 데이터 popularityScore 계산
UPDATE posts
SET popularity_score = (view_count * 5 + scrap_count * 50)
WHERE popularity_score = 0;
