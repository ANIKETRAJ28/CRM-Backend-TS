/*
  Warnings:

  - A unique constraint covering the columns `[userId,orgId]` on the table `user_org` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_org_userId_orgId_key" ON "user_org"("userId", "orgId");
