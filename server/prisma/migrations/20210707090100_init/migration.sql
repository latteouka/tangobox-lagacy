-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "password" TEXT,
    "role" INTEGER NOT NULL DEFAULT 0,
    "dailyNew5" INTEGER NOT NULL DEFAULT 3,
    "dailyNewT" INTEGER NOT NULL DEFAULT 10,
    "dailyNewG" INTEGER NOT NULL DEFAULT 10,
    "active5" TEXT,
    "activeT" TEXT,
    "activeG" TEXT,
    "due" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "subId" TEXT NOT NULL,
    "rtncode" INTEGER,
    "rtnmsg" TEXT,
    "tradeNo" TEXT,
    "tradeamt" INTEGER,
    "paymentDate" TEXT,
    "paymentType" TEXT,
    "tradeDate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subrecord" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "subId" TEXT NOT NULL,
    "rtncode" INTEGER NOT NULL,
    "rtnmsg" TEXT NOT NULL,
    "periodType" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL,
    "execTimes" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "gwsr" INTEGER NOT NULL,
    "time" TEXT NOT NULL,
    "authcode" TEXT NOT NULL,
    "firstAmount" INTEGER NOT NULL,
    "totalTimes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User.uuid_unique" ON "User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Trade.subId_unique" ON "Trade"("subId");
