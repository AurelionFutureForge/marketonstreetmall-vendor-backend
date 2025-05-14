/*
  Warnings:

  - You are about to drop the column `vendor_id` on the `Category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[category_id]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_vendor_id_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "vendor_id";

-- CreateTable
CREATE TABLE "_CategoryToVendor" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToVendor_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryToVendor_B_index" ON "_CategoryToVendor"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Category_category_id_key" ON "Category"("category_id");

-- AddForeignKey
ALTER TABLE "_CategoryToVendor" ADD CONSTRAINT "_CategoryToVendor_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToVendor" ADD CONSTRAINT "_CategoryToVendor_B_fkey" FOREIGN KEY ("B") REFERENCES "Vendor"("vendor_id") ON DELETE CASCADE ON UPDATE CASCADE;
