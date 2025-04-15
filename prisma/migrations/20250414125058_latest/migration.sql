/*
  Warnings:

  - A unique constraint covering the columns `[mobile_number]` on the table `CmsUser` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Otp" DROP CONSTRAINT "otp_vendor_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "CmsUser_mobile_number_key" ON "CmsUser"("mobile_number");
