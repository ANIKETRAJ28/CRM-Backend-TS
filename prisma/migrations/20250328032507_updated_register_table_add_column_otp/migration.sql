/*
  Warnings:

  - Added the required column `otp` to the `register` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "register" ADD COLUMN     "otp" VARCHAR(6) NOT NULL;
