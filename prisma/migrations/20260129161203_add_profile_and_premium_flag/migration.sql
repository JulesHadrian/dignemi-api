-- AlterTable
ALTER TABLE "ContentItem" ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profile" JSONB;
