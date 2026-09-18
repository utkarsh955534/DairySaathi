-- CreateTable
CREATE TABLE "WeightRecord" (
    "id" SERIAL NOT NULL,
    "animalId" INTEGER NOT NULL,
    "recordDate" TIMESTAMP(3) NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeightRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WeightRecord_animalId_idx" ON "WeightRecord"("animalId");

-- CreateIndex
CREATE INDEX "WeightRecord_recordDate_idx" ON "WeightRecord"("recordDate");

-- CreateIndex
CREATE UNIQUE INDEX "WeightRecord_animalId_recordDate_key" ON "WeightRecord"("animalId", "recordDate");

-- AddForeignKey
ALTER TABLE "WeightRecord" ADD CONSTRAINT "WeightRecord_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
