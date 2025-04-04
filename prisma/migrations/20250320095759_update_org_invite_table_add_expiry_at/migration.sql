/*
  Warnings:

  - Added the required column `expiryAt` to the `org_invite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "org_invite" ADD COLUMN     "expiryAt" TIMESTAMP(3) NOT NULL;
