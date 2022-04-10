/*
  Warnings:

  - You are about to drop the column `active5` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `activeG` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `activeT` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `dailyNew5` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `dailyNewG` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `dailyNewT` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "active5",
DROP COLUMN "activeG",
DROP COLUMN "activeT",
DROP COLUMN "dailyNew5",
DROP COLUMN "dailyNewG",
DROP COLUMN "dailyNewT";
