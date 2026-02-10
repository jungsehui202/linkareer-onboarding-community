/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "posts_created_at_idx";

-- DropIndex
DROP INDEX "posts_scrap_count_idx";

-- DropIndex
DROP INDEX "posts_view_count_created_at_idx";

-- DropIndex
DROP INDEX "posts_view_count_idx";

-- DropIndex
DROP INDEX "posts_view_count_scrap_count_idx";

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "posts_deleted_at_idx" ON "posts"("deleted_at");

-- CreateIndex
CREATE INDEX "posts_popularity_score_idx" ON "posts"("popularity_score" DESC);

-- CreateIndex
CREATE INDEX "posts_created_at_idx" ON "posts"("created_at" DESC);

-- CreateIndex
CREATE INDEX "posts_deleted_at_view_count_idx" ON "posts"("deleted_at", "view_count" DESC);

-- CreateIndex
CREATE INDEX "posts_deleted_at_popularity_score_idx" ON "posts"("deleted_at", "popularity_score" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- Full-Text Search 인덱스
CREATE INDEX IF NOT EXISTS idx_posts_fts_combined
ON posts USING GIN (to_tsvector('simple', COALESCE(title, '') || ' ' || COALESCE(content, '')))
WHERE deleted_at IS NULL;

-- Partial Index (정렬 최적화)
CREATE INDEX IF NOT EXISTS idx_posts_active_popularity
ON posts (popularity_score DESC, created_at DESC)
WHERE deleted_at IS NULL;
