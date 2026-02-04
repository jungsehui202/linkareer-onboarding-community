/*
  Warnings:

  - You are about to drop the column `subscribe_email` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `subscribe_sms` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "subscribe_email",
DROP COLUMN "subscribe_sms";

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");
