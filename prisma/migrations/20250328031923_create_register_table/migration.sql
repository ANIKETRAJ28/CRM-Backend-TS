-- CreateTable
CREATE TABLE "register" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isRegistered" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "register_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "register_email_key" ON "register"("email");
