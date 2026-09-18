-- CreateTable
CREATE TABLE "LactationRecord" (
    "id" SERIAL NOT NULL,
    "animalId" INTEGER NOT NULL,
    "lactationNumber" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "totalMilk" DOUBLE PRECISION,
    "peakMilk" DOUBLE PRECISION,
    "calfId" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LactationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LactationRecord_animalId_idx" ON "LactationRecord"("animalId");

-- CreateIndex
CREATE INDEX "LactationRecord_calfId_idx" ON "LactationRecord"("calfId");

-- CreateIndex
CREATE UNIQUE INDEX "LactationRecord_animalId_lactationNumber_key" ON "LactationRecord"("animalId", "lactationNumber");

-- AddForeignKey
ALTER TABLE "LactationRecord" ADD CONSTRAINT "LactationRecord_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LactationRecord" ADD CONSTRAINT "LactationRecord_calfId_fkey" FOREIGN KEY ("calfId") REFERENCES "Animal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
