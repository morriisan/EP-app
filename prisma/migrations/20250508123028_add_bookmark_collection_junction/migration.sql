/*
  Warnings:

  - You are about to drop the column `collectionId` on the `bookmark` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "bookmark" DROP CONSTRAINT "bookmark_collectionId_fkey";

-- AlterTable
ALTER TABLE "bookmark" DROP COLUMN "collectionId";

-- CreateTable
CREATE TABLE "bookmark_collection" (
    "bookmarkId" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,

    CONSTRAINT "bookmark_collection_pkey" PRIMARY KEY ("bookmarkId","collectionId")
);

-- AddForeignKey
ALTER TABLE "bookmark_collection" ADD CONSTRAINT "bookmark_collection_bookmarkId_fkey" FOREIGN KEY ("bookmarkId") REFERENCES "bookmark"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmark_collection" ADD CONSTRAINT "bookmark_collection_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
