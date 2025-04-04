/*
  Warnings:

  - A unique constraint covering the columns `[hashCode]` on the table `org_invite` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "org_invite_hashCode_key" ON "org_invite"("hashCode");
