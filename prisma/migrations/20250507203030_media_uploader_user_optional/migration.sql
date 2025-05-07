-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_uploadedById_fkey";

-- AlterTable
ALTER TABLE "media" ALTER COLUMN "uploadedById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
