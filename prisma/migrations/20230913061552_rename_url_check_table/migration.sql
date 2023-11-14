-- CreateEnum
CREATE TYPE "UrlStatus" AS ENUM ('UP', 'DOWN');

-- CreateEnum
CREATE TYPE "Protocol" AS ENUM ('HTPP', 'HTPPS', 'TCP');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UrlCheck" (
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "protocol" "Protocol" NOT NULL,
    "path" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "timeout" INTEGER NOT NULL DEFAULT 5,
    "interval" INTEGER NOT NULL DEFAULT 600,
    "threshold" INTEGER NOT NULL DEFAULT 1,
    "httpHeaders" JSONB NOT NULL,
    "assert" JSONB NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ignoreSSL" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UrlCheck_pkey" PRIMARY KEY ("url","userId")
);

-- CreateTable
CREATE TABLE "UrlLog" (
    "id" SERIAL NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "UrlStatus" NOT NULL,
    "responseTime" INTEGER,
    "UrlCheckUrl" TEXT NOT NULL,
    "UrlCheckUserId" INTEGER NOT NULL,

    CONSTRAINT "UrlLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "UrlCheck" ADD CONSTRAINT "UrlCheck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UrlLog" ADD CONSTRAINT "UrlLog_UrlCheckUrl_UrlCheckUserId_fkey" FOREIGN KEY ("UrlCheckUrl", "UrlCheckUserId") REFERENCES "UrlCheck"("url", "userId") ON DELETE RESTRICT ON UPDATE CASCADE;
