-- CreateEnum
CREATE TYPE "AnimalSpecies" AS ENUM ('COW', 'BUFFALO');

-- CreateEnum
CREATE TYPE "AnimalSex" AS ENUM ('FEMALE', 'MALE');

-- CreateEnum
CREATE TYPE "AnimalLifeStage" AS ENUM ('CALF', 'HEIFER', 'ADULT');

-- CreateEnum
CREATE TYPE "ProductionStatus" AS ENUM ('LACTATING', 'DRY', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "PregnancyStatus" AS ENUM ('NOT_APPLICABLE', 'NOT_PREGNANT', 'PREGNANT');

-- CreateTable
CREATE TABLE "Animal" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "tagNumber" TEXT NOT NULL,
    "species" "AnimalSpecies" NOT NULL,
    "sex" "AnimalSex" NOT NULL,
    "lifeStage" "AnimalLifeStage" NOT NULL,
    "breed" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "weight" DOUBLE PRECISION,
    "photoUrl" TEXT,
    "motherId" INTEGER,
    "fatherId" INTEGER,
    "productionStatus" "ProductionStatus" NOT NULL DEFAULT 'NOT_APPLICABLE',
    "lactationNumber" INTEGER,
    "lactationStartDate" TIMESTAMP(3),
    "currentMilkProduction" DOUBLE PRECISION,
    "pregnancyStatus" "PregnancyStatus" NOT NULL DEFAULT 'NOT_APPLICABLE',
    "lastCalvingDate" TIMESTAMP(3),
    "expectedCalvingDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Animal_userId_idx" ON "Animal"("userId");

-- CreateIndex
CREATE INDEX "Animal_species_idx" ON "Animal"("species");

-- CreateIndex
CREATE INDEX "Animal_sex_idx" ON "Animal"("sex");

-- CreateIndex
CREATE INDEX "Animal_lifeStage_idx" ON "Animal"("lifeStage");

-- CreateIndex
CREATE UNIQUE INDEX "Animal_userId_tagNumber_key" ON "Animal"("userId", "tagNumber");

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Animal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_fatherId_fkey" FOREIGN KEY ("fatherId") REFERENCES "Animal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
