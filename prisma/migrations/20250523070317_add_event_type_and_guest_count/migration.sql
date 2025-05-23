/*
  Warnings:

  - Added the required column `eventType` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestCount` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventType` to the `booking_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestCount` to the `booking_history` table without a default value. This is not possible if the table is not empty.

*/
-- Step 1: Add columns as nullable with defaults
ALTER TABLE "Booking" 
ADD COLUMN IF NOT EXISTS "eventType" TEXT,
ADD COLUMN IF NOT EXISTS "guestCount" INTEGER;

ALTER TABLE "booking_history" 
ADD COLUMN IF NOT EXISTS "eventType" TEXT,
ADD COLUMN IF NOT EXISTS "guestCount" INTEGER;

-- Step 2: Update existing records with default values
UPDATE "Booking"
SET "eventType" = 'WEDDING',
    "guestCount" = 100
WHERE "eventType" IS NULL OR "guestCount" IS NULL;

UPDATE "booking_history"
SET "eventType" = 'WEDDING',
    "guestCount" = 100
WHERE "eventType" IS NULL OR "guestCount" IS NULL;

-- Step 3: Make columns required after data is updated
ALTER TABLE "Booking"
ALTER COLUMN "eventType" SET NOT NULL,
ALTER COLUMN "guestCount" SET NOT NULL;

ALTER TABLE "booking_history"
ALTER COLUMN "eventType" SET NOT NULL,
ALTER COLUMN "guestCount" SET NOT NULL;
