/*
  Warnings:

  - You are about to drop the column `isWas` on the `Reservation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "isWas",
ADD COLUMN     "iWas" BOOLEAN;
