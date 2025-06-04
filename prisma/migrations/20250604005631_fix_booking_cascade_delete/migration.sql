/*
  Warnings:

  - You are about to drop the column `userEmail` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `Booking` table. All the data in the column will be lost.
  - Made the column `userId` on table `Booking` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "userEmail",
DROP COLUMN "userName",
ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
