-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "favorite" BOOLEAN NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_contact" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_contact_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_contact_B_index" ON "_contact"("B");

-- AddForeignKey
ALTER TABLE "_contact" ADD CONSTRAINT "_contact_A_fkey" FOREIGN KEY ("A") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_contact" ADD CONSTRAINT "_contact_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
