/*
  Warnings:

  - You are about to drop the column `userOrgId` on the `ticket` table. All the data in the column will be lost.
  - Added the required column `orgId` to the `ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ticket" DROP CONSTRAINT "ticket_userOrgId_fkey";

-- AlterTable
ALTER TABLE "ticket" DROP COLUMN "userOrgId",
ADD COLUMN     "orgId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
