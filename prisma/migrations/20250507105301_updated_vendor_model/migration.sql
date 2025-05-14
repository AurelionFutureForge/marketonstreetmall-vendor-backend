/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `category_id` on the `SubcategoryGroup` table. All the data in the column will be lost.
  - The required column `id` was added to the `Category` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `vendor_id` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `SubcategoryGroup` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SubcategoryGroup" DROP CONSTRAINT "SubcategoryGroup_category_id_fkey";

-- DropIndex
DROP INDEX "Category_name_key";

-- DropIndex
DROP INDEX "SubcategoryGroup_category_id_idx";

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "vendor_id" TEXT NOT NULL,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SubcategoryGroup" DROP COLUMN "category_id",
ADD COLUMN     "id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "SubcategoryGroup_id_idx" ON "SubcategoryGroup"("id");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("vendor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubcategoryGroup" ADD CONSTRAINT "SubcategoryGroup_id_fkey" FOREIGN KEY ("id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
