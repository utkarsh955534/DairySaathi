-- CreateEnum
CREATE TYPE "HealthType" AS ENUM ('DEWORMING', 'VACCINATION', 'TREATMENT', 'CHECKUP', 'OTHER');

-- CreateTable
CREATE TABLE "HealthRecord" (
    "id" SERIAL NOT NULL,
    "animalId" INTEGER NOT NULL,
    "type" "HealthType" NOT NULL,
    "recordDate" TIMESTAMP(3) NOT NULL,
    "medicine" TEXT,
    "dose" TEXT,
    "nextDue" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HealthRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HealthRecord_animalId_idx" ON "HealthRecord"("animalId");

-- CreateIndex
CREATE INDEX "HealthRecord_recordDate_idx" ON "HealthRecord"("recordDate");

-- CreateIndex
CREATE INDEX "HealthRecord_type_idx" ON "HealthRecord"("type");

-- AddForeignKey
ALTER TABLE "HealthRecord" ADD CONSTRAINT "HealthRecord_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
