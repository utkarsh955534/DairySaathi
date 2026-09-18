/*
  Warnings:

  - A unique constraint covering the columns `[publicToken]` on the table `Animal` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Animal" ADD COLUMN     "publicToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Animal_publicToken_key" ON "Animal"("publicToken");
