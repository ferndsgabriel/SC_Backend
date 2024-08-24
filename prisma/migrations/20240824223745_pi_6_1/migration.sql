/*
  Warnings:

  - You are about to drop the column `isFinished` on the `Reservation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "isFinished",
ADD COLUMN     "isEvaluated" BOOLEAN NOT NULL DEFAULT false;
