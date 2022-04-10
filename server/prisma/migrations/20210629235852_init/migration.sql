-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "password" TEXT,
    "role" INTEGER NOT NULL DEFAULT 0,
    "dailyNew" INTEGER NOT NULL DEFAULT 20,
    "dailyNew50h" INTEGER NOT NULL DEFAULT 5,
    "dailyNew50k" INTEGER NOT NULL DEFAULT 5,
    "active" TEXT[],
    "due" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User.uuid_unique" ON "User"("uuid");
