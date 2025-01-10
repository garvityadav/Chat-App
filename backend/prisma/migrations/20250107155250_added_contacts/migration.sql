/*
  Warnings:

  - You are about to drop the `_contact` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_contact" DROP CONSTRAINT "_contact_A_fkey";

-- DropForeignKey
ALTER TABLE "_contact" DROP CONSTRAINT "_contact_B_fkey";

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "favorite" SET DEFAULT false;

-- DropTable
DROP TABLE "_contact";

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
