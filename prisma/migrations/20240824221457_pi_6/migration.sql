/*
  Warnings:

  - You are about to drop the column `value` on the `Avaliations` table. All the data in the column will be lost.
  - You are about to drop the column `approvalDate` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `iWas` on the `Reservation` table. All the data in the column will be lost.
  - Added the required column `ease` to the `Avaliations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hygiene` to the `Avaliations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `space` to the `Avaliations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Avaliations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Avaliations" DROP COLUMN "value",
ADD COLUMN     "ease" INTEGER NOT NULL,
ADD COLUMN     "hygiene" INTEGER NOT NULL,
ADD COLUMN     "space" INTEGER NOT NULL,
ADD COLUMN     "time" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "approvalDate",
DROP COLUMN "iWas",
ADD COLUMN     "isFinished" BOOLEAN;
