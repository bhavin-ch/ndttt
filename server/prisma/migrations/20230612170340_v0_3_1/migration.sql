/*
  Warnings:

  - Added the required column `dimensions` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gridSize` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "dimensions" INTEGER NOT NULL,
ADD COLUMN     "gridSize" INTEGER NOT NULL;
