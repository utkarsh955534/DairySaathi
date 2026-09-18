-- AlterTable
ALTER TABLE "Animal" ALTER COLUMN "sex" DROP NOT NULL;

-- CreateTable
CREATE TABLE "CalvingRecord" (
    "id" SERIAL NOT NULL,
    "motherId" INTEGER NOT NULL,
    "calfId" INTEGER,
    "calvingDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CalvingRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CalvingRecord_motherId_idx" ON "CalvingRecord"("motherId");

-- CreateIndex
CREATE INDEX "CalvingRecord_calfId_idx" ON "CalvingRecord"("calfId");

-- CreateIndex
CREATE INDEX "CalvingRecord_calvingDate_idx" ON "CalvingRecord"("calvingDate");

-- AddForeignKey
ALTER TABLE "CalvingRecord" ADD CONSTRAINT "CalvingRecord_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalvingRecord" ADD CONSTRAINT "CalvingRecord_calfId_fkey" FOREIGN KEY ("calfId") REFERENCES "Animal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
