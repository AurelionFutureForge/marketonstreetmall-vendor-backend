/*
  Warnings:

  - You are about to drop the column `email` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the `CmsUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Otp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PasswordReset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductAttribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductVariant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubVariant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TokenBlacklist` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[vendor_email]` on the table `Vendor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `vendor_email` to the `Vendor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendor_name` to the `Vendor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendor_phone` to the `Vendor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_product_id_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_sub_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_vendor_id_fkey";

-- DropForeignKey
ALTER TABLE "Otp" DROP CONSTRAINT "otp_cmsuser_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_subcategory_id_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_vendor_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductAttribute" DROP CONSTRAINT "ProductAttribute_product_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductHistory" DROP CONSTRAINT "ProductHistory_product_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_product_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_product_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_product_id_fkey";

-- DropForeignKey
ALTER TABLE "SubVariant" DROP CONSTRAINT "SubVariant_variant_id_fkey";

-- DropIndex
DROP INDEX "Vendor_email_idx";

-- DropIndex
DROP INDEX "Vendor_email_key";

-- DropIndex
DROP INDEX "Vendor_phone_idx";

-- DropIndex
DROP INDEX "Vendor_role_idx";

-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "password",
DROP COLUMN "phone",
DROP COLUMN "role",
ADD COLUMN     "vendor_email" TEXT NOT NULL,
ADD COLUMN     "vendor_name" TEXT NOT NULL,
ADD COLUMN     "vendor_phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "VendorUser" ALTER COLUMN "role" SET DEFAULT 'VENDOR_ADMIN';

-- DropTable
DROP TABLE "CmsUser";

-- DropTable
DROP TABLE "Inventory";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "Otp";

-- DropTable
DROP TABLE "PasswordReset";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "ProductAttribute";

-- DropTable
DROP TABLE "ProductHistory";

-- DropTable
DROP TABLE "ProductImage";

-- DropTable
DROP TABLE "ProductVariant";

-- DropTable
DROP TABLE "SubVariant";

-- DropTable
DROP TABLE "TokenBlacklist";

-- DropEnum
DROP TYPE "CMSRole";

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "ProductStatus";

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_vendor_email_key" ON "Vendor"("vendor_email");

-- CreateIndex
CREATE INDEX "Vendor_vendor_email_idx" ON "Vendor"("vendor_email");

-- CreateIndex
CREATE INDEX "Vendor_vendor_phone_idx" ON "Vendor"("vendor_phone");
