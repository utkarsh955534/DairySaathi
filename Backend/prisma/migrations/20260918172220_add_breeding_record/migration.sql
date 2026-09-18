-- CreateEnum
CREATE TYPE "BreedingType" AS ENUM ('HEAT', 'INSEMINATION', 'PREGNANCY_CHECK');

-- CreateTable
CREATE TABLE "BreedingRecord" (
    "id" SERIAL NOT NULL,
    "animalId" INTEGER NOT NULL,
    "type" "BreedingType" NOT NULL,
    "recordDate" TIMESTAMP(3) NOT NULL,
    "heatObservation" TEXT,
    "semenCode" TEXT,
    "technician" TEXT,
    "pregnancyResult" BOOLEAN,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BreedingRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BreedingRecord_animalId_idx" ON "BreedingRecord"("animalId");

-- CreateIndex
CREATE INDEX "BreedingRecord_recordDate_idx" ON "BreedingRecord"("recordDate");

-- CreateIndex
CREATE INDEX "BreedingRecord_type_idx" ON "BreedingRecord"("type");

-- AddForeignKey
ALTER TABLE "BreedingRecord" ADD CONSTRAINT "BreedingRecord_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
