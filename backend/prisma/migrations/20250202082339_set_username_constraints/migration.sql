/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usernameId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usernameId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "username",
ADD COLUMN     "usernameId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Username" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "username" TEXT NOT NULL,
    "hashTag" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Username_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Username_userId_key" ON "Username"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Username_fullName_key" ON "Username"("fullName");

-- CreateIndex
CREATE INDEX "Username_username_idx" ON "Username"("username");

-- CreateIndex
CREATE INDEX "Username_hashTag_idx" ON "Username"("hashTag");

-- CreateIndex
CREATE UNIQUE INDEX "Username_username_hashTag_key" ON "Username"("username", "hashTag");

-- CreateIndex
CREATE UNIQUE INDEX "User_usernameId_key" ON "User"("usernameId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_usernameId_fkey" FOREIGN KEY ("usernameId") REFERENCES "Username"("id") ON DELETE CASCADE ON UPDATE CASCADE;
