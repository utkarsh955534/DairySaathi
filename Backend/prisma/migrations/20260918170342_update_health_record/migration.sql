/*
  Warnings:

  - You are about to drop the column `medicine` on the `HealthRecord` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HealthRecord" DROP COLUMN "medicine",
ADD COLUMN     "checkupType" TEXT,
ADD COLUMN     "details" TEXT,
ADD COLUMN     "dewormerName" TEXT,
ADD COLUMN     "diagnosis" TEXT,
ADD COLUMN     "findings" TEXT,
ADD COLUMN     "problem" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "treatmentDose" TEXT,
ADD COLUMN     "treatmentMedicine" TEXT,
ADD COLUMN     "treatmentNextReview" TIMESTAMP(3),
ADD COLUMN     "vaccineName" TEXT;
