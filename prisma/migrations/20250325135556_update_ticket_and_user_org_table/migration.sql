/*
  Warnings:

  - You are about to drop the column `orgId` on the `ticket` table. All the data in the column will be lost.
  - Added the required column `userOrgId` to the `ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ticket" DROP CONSTRAINT "ticket_orgId_fkey";

-- AlterTable
ALTER TABLE "ticket" DROP COLUMN "orgId",
ADD COLUMN     "userOrgId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_userOrgId_fkey" FOREIGN KEY ("userOrgId") REFERENCES "user_org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
