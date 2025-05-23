/*
  Warnings:

  - Added the required column `eventType` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestCount` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventType` to the `booking_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestCount` to the `booking_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "eventType" TEXT NOT NULL,
ADD COLUMN     "guestCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "booking_history" ADD COLUMN     "eventType" TEXT NOT NULL,
ADD COLUMN     "guestCount" INTEGER NOT NULL;
