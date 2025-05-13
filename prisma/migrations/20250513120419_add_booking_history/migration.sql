-- CreateTable
CREATE TABLE "booking_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "description" TEXT,
    "status" "BookingStatus" NOT NULL,
    "originalBookingId" TEXT NOT NULL,
    "movedToHistoryAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT NOT NULL,
    "waitlistPos" INTEGER,
    "reviewedById" TEXT,
    "reviewNote" TEXT,

    CONSTRAINT "booking_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "booking_history" ADD CONSTRAINT "booking_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
