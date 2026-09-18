/*
  Warnings:

  - You are about to drop the `OtpVerification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OtpVerification" DROP CONSTRAINT "OtpVerification_userId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "emailVerified" SET DEFAULT true,
ALTER COLUMN "isActive" SET DEFAULT true;

-- DropTable
DROP TABLE "OtpVerification";

-- DropEnum
DROP TYPE "OtpType";

-- CreateTable
CREATE TABLE "MilkRecord" (
    "id" SERIAL NOT NULL,
    "animalId" INTEGER NOT NULL,
    "recordDate" TIMESTAMP(3) NOT NULL,
    "morning" DOUBLE PRECISION,
    "evening" DOUBLE PRECISION,
    "total" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MilkRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MilkRecord_animalId_idx" ON "MilkRecord"("animalId");

-- CreateIndex
CREATE INDEX "MilkRecord_recordDate_idx" ON "MilkRecord"("recordDate");

-- CreateIndex
CREATE UNIQUE INDEX "MilkRecord_animalId_recordDate_key" ON "MilkRecord"("animalId", "recordDate");

-- AddForeignKey
ALTER TABLE "MilkRecord" ADD CONSTRAINT "MilkRecord_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
