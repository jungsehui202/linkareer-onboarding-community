-- AlterTable
ALTER TABLE "users" ADD COLUMN     "subscribe_email" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subscribe_sms" BOOLEAN NOT NULL DEFAULT false;
