-- CreateEnum
CREATE TYPE "ParentSource" AS ENUM ('EXISTING', 'EXTERNAL', 'UNKNOWN');

-- AlterTable
ALTER TABLE "Animal" ADD COLUMN     "fatherExternalBreed" TEXT,
ADD COLUMN     "fatherExternalName" TEXT,
ADD COLUMN     "fatherExternalTag" TEXT,
ADD COLUMN     "fatherSource" "ParentSource" NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN     "motherExternalBreed" TEXT,
ADD COLUMN     "motherExternalName" TEXT,
ADD COLUMN     "motherExternalTag" TEXT,
ADD COLUMN     "motherSource" "ParentSource" NOT NULL DEFAULT 'UNKNOWN';

-- CreateIndex
CREATE INDEX "Animal_motherId_idx" ON "Animal"("motherId");

-- CreateIndex
CREATE INDEX "Animal_fatherId_idx" ON "Animal"("fatherId");
