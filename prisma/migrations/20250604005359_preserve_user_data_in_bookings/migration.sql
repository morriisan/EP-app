-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- DropForeignKey
ALTER TABLE "booking_history" DROP CONSTRAINT "booking_history_userId_fkey";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "userEmail" TEXT,
ADD COLUMN     "userName" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "booking_history" ADD COLUMN     "userEmail" TEXT,
ADD COLUMN     "userName" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_history" ADD CONSTRAINT "booking_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
