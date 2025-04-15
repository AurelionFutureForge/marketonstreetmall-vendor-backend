-- CreateEnum
CREATE TYPE "CMSRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'PRODUCT_ADMIN');

-- CreateEnum
CREATE TYPE "VendorRole" AS ENUM ('VENDOR_ADMIN', 'PRODUCT_ADMIN');

-- CreateEnum
CREATE TYPE "WarehouseVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'LIVE', 'OUT_OF_STOCK');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('RECEIVED', 'PROCESSING', 'PACKED', 'SHIPPED', 'DELIVERED');

-- CreateTable
CREATE TABLE "CmsUser" (
    "cms_user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "role" "CMSRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CmsUser_pkey" PRIMARY KEY ("cms_user_id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "vendor_id" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "legal_name" TEXT NOT NULL,
    "gstin" TEXT,
    "pan" TEXT,
    "commission_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "VendorRole" NOT NULL DEFAULT 'VENDOR_ADMIN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("vendor_id")
);

-- CreateTable
CREATE TABLE "BankDetail" (
    "bank_detail_id" TEXT NOT NULL,
    "account_name" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "ifsc_code" TEXT NOT NULL,
    "bank_name" TEXT NOT NULL,
    "branch_name" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "vendor_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankDetail_pkey" PRIMARY KEY ("bank_detail_id")
);

-- CreateTable
CREATE TABLE "VendorUser" (
    "vendor_user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "VendorRole" NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorUser_pkey" PRIMARY KEY ("vendor_user_id")
);

-- CreateTable
CREATE TABLE "Warehouse" (
    "warehouse_id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "pincode" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "contact_person" TEXT,
    "contact_phone" TEXT,
    "verified_at" TIMESTAMP(3),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "verification_status" "WarehouseVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "vendor_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("warehouse_id")
);

-- CreateTable
CREATE TABLE "Category" (
    "category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "SubcategoryGroup" (
    "group_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "SubcategoryGroup_pkey" PRIMARY KEY ("group_id")
);

-- CreateTable
CREATE TABLE "Subcategory" (
    "subcategory_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "group_id" TEXT NOT NULL,

    CONSTRAINT "Subcategory_pkey" PRIMARY KEY ("subcategory_id")
);

-- CreateTable
CREATE TABLE "Product" (
    "product_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION,
    "stock" INTEGER NOT NULL,
    "status" "ProductStatus" NOT NULL DEFAULT 'PENDING',
    "thumbnail" TEXT,
    "thumbnail_url" TEXT,
    "product_title" TEXT,
    "product_brand" TEXT,
    "type_product" TEXT,
    "skn" TEXT,
    "fragile" BOOLEAN,
    "free_delivery" BOOLEAN,
    "is_deleted" BOOLEAN,
    "is_public" BOOLEAN,
    "refund_policy" TEXT,
    "shipping_cost_factor" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "vendor_id" TEXT NOT NULL,
    "subcategory_id" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "ProductHistory" (
    "history_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "comment" TEXT,
    "product_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductHistory_pkey" PRIMARY KEY ("history_id")
);

-- CreateTable
CREATE TABLE "Order" (
    "order_id" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'RECEIVED',
    "amount" DOUBLE PRECISION NOT NULL,
    "product_json" JSONB NOT NULL,
    "tracking_url" TEXT,
    "shiprocket_order_id" TEXT,
    "shiprocket_shipment_id" TEXT,
    "expected_delivery_date" TIMESTAMP(3),
    "actual_delivery_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "vendor_id" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "variant_id" TEXT NOT NULL,
    "variant_title" TEXT NOT NULL,
    "variant_value" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "variant_price" DOUBLE PRECISION,
    "variant_discount_price" DOUBLE PRECISION,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "stock_quantity" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("variant_id")
);

-- CreateTable
CREATE TABLE "SubVariant" (
    "sub_variant_id" TEXT NOT NULL,
    "sub_variant_title" TEXT NOT NULL,
    "sub_variant_value" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "sub_variant_price" DOUBLE PRECISION NOT NULL,
    "sub_variant_discount" DOUBLE PRECISION,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "stock_quantity" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "variant_id" TEXT NOT NULL,

    CONSTRAINT "SubVariant_pkey" PRIMARY KEY ("sub_variant_id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "image_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "product_id" TEXT NOT NULL,
    "product_variant_id" TEXT,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("image_id")
);

-- CreateTable
CREATE TABLE "ProductAttribute" (
    "attributes_id" TEXT NOT NULL,
    "attributes_title" TEXT NOT NULL,
    "attribute_value" JSONB NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "ProductAttribute_pkey" PRIMARY KEY ("attributes_id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "inventory_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "safety_stock" INTEGER,
    "reorder_level" INTEGER,
    "reorder_quantity" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "product_id" TEXT NOT NULL,
    "variant_id" TEXT,
    "sub_variant_id" TEXT,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("inventory_id")
);

-- CreateTable
CREATE TABLE "PasswordReset" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordReset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Otp" (
    "otp_id" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "otp_expiration" TIMESTAMP(3) NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("otp_id")
);

-- CreateTable
CREATE TABLE "TokenBlacklist" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenBlacklist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CmsUser_email_key" ON "CmsUser"("email");

-- CreateIndex
CREATE INDEX "CmsUser_role_idx" ON "CmsUser"("role");

-- CreateIndex
CREATE INDEX "CmsUser_email_idx" ON "CmsUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_gstin_key" ON "Vendor"("gstin");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_pan_key" ON "Vendor"("pan");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_email_key" ON "Vendor"("email");

-- CreateIndex
CREATE INDEX "Vendor_email_idx" ON "Vendor"("email");

-- CreateIndex
CREATE INDEX "Vendor_phone_idx" ON "Vendor"("phone");

-- CreateIndex
CREATE INDEX "Vendor_business_name_idx" ON "Vendor"("business_name");

-- CreateIndex
CREATE INDEX "Vendor_role_idx" ON "Vendor"("role");

-- CreateIndex
CREATE INDEX "Vendor_onboarding_completed_idx" ON "Vendor"("onboarding_completed");

-- CreateIndex
CREATE UNIQUE INDEX "BankDetail_vendor_id_key" ON "BankDetail"("vendor_id");

-- CreateIndex
CREATE INDEX "BankDetail_vendor_id_idx" ON "BankDetail"("vendor_id");

-- CreateIndex
CREATE INDEX "BankDetail_is_verified_idx" ON "BankDetail"("is_verified");

-- CreateIndex
CREATE UNIQUE INDEX "VendorUser_email_key" ON "VendorUser"("email");

-- CreateIndex
CREATE INDEX "VendorUser_vendor_id_idx" ON "VendorUser"("vendor_id");

-- CreateIndex
CREATE INDEX "VendorUser_email_idx" ON "VendorUser"("email");

-- CreateIndex
CREATE INDEX "VendorUser_role_idx" ON "VendorUser"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_vendor_id_key" ON "Warehouse"("vendor_id");

-- CreateIndex
CREATE INDEX "Warehouse_vendor_id_idx" ON "Warehouse"("vendor_id");

-- CreateIndex
CREATE INDEX "Warehouse_verification_status_idx" ON "Warehouse"("verification_status");

-- CreateIndex
CREATE INDEX "Warehouse_city_state_idx" ON "Warehouse"("city", "state");

-- CreateIndex
CREATE INDEX "Warehouse_pincode_idx" ON "Warehouse"("pincode");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Category_is_public_idx" ON "Category"("is_public");

-- CreateIndex
CREATE UNIQUE INDEX "SubcategoryGroup_name_key" ON "SubcategoryGroup"("name");

-- CreateIndex
CREATE INDEX "SubcategoryGroup_category_id_idx" ON "SubcategoryGroup"("category_id");

-- CreateIndex
CREATE INDEX "SubcategoryGroup_is_public_idx" ON "SubcategoryGroup"("is_public");

-- CreateIndex
CREATE INDEX "Subcategory_group_id_idx" ON "Subcategory"("group_id");

-- CreateIndex
CREATE INDEX "Subcategory_is_public_idx" ON "Subcategory"("is_public");

-- CreateIndex
CREATE UNIQUE INDEX "Subcategory_name_group_id_key" ON "Subcategory"("name", "group_id");

-- CreateIndex
CREATE INDEX "Product_vendor_id_idx" ON "Product"("vendor_id");

-- CreateIndex
CREATE INDEX "Product_subcategory_id_idx" ON "Product"("subcategory_id");

-- CreateIndex
CREATE INDEX "Product_status_idx" ON "Product"("status");

-- CreateIndex
CREATE INDEX "Product_created_at_idx" ON "Product"("created_at");

-- CreateIndex
CREATE INDEX "Product_title_idx" ON "Product"("title");

-- CreateIndex
CREATE INDEX "Product_price_idx" ON "Product"("price");

-- CreateIndex
CREATE INDEX "Product_stock_idx" ON "Product"("stock");

-- CreateIndex
CREATE INDEX "Product_product_brand_idx" ON "Product"("product_brand");

-- CreateIndex
CREATE INDEX "Product_is_public_idx" ON "Product"("is_public");

-- CreateIndex
CREATE INDEX "Product_is_deleted_idx" ON "Product"("is_deleted");

-- CreateIndex
CREATE INDEX "ProductHistory_product_id_idx" ON "ProductHistory"("product_id");

-- CreateIndex
CREATE INDEX "ProductHistory_created_at_idx" ON "ProductHistory"("created_at");

-- CreateIndex
CREATE INDEX "ProductHistory_action_idx" ON "ProductHistory"("action");

-- CreateIndex
CREATE INDEX "Order_vendor_id_idx" ON "Order"("vendor_id");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_created_at_idx" ON "Order"("created_at");

-- CreateIndex
CREATE INDEX "Order_expected_delivery_date_idx" ON "Order"("expected_delivery_date");

-- CreateIndex
CREATE INDEX "Order_shiprocket_order_id_idx" ON "Order"("shiprocket_order_id");

-- CreateIndex
CREATE INDEX "Order_shiprocket_shipment_id_idx" ON "Order"("shiprocket_shipment_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");

-- CreateIndex
CREATE INDEX "ProductVariant_product_id_idx" ON "ProductVariant"("product_id");

-- CreateIndex
CREATE INDEX "ProductVariant_sku_idx" ON "ProductVariant"("sku");

-- CreateIndex
CREATE INDEX "ProductVariant_is_default_idx" ON "ProductVariant"("is_default");

-- CreateIndex
CREATE INDEX "ProductVariant_variant_title_variant_value_idx" ON "ProductVariant"("variant_title", "variant_value");

-- CreateIndex
CREATE UNIQUE INDEX "SubVariant_sku_key" ON "SubVariant"("sku");

-- CreateIndex
CREATE INDEX "SubVariant_variant_id_idx" ON "SubVariant"("variant_id");

-- CreateIndex
CREATE INDEX "SubVariant_sku_idx" ON "SubVariant"("sku");

-- CreateIndex
CREATE INDEX "SubVariant_is_default_idx" ON "SubVariant"("is_default");

-- CreateIndex
CREATE INDEX "SubVariant_sub_variant_title_sub_variant_value_idx" ON "SubVariant"("sub_variant_title", "sub_variant_value");

-- CreateIndex
CREATE INDEX "ProductImage_product_id_idx" ON "ProductImage"("product_id");

-- CreateIndex
CREATE INDEX "ProductImage_product_variant_id_idx" ON "ProductImage"("product_variant_id");

-- CreateIndex
CREATE INDEX "ProductImage_is_default_idx" ON "ProductImage"("is_default");

-- CreateIndex
CREATE INDEX "ProductAttribute_product_id_idx" ON "ProductAttribute"("product_id");

-- CreateIndex
CREATE INDEX "ProductAttribute_attributes_title_idx" ON "ProductAttribute"("attributes_title");

-- CreateIndex
CREATE INDEX "Inventory_product_id_idx" ON "Inventory"("product_id");

-- CreateIndex
CREATE INDEX "Inventory_variant_id_idx" ON "Inventory"("variant_id");

-- CreateIndex
CREATE INDEX "Inventory_sub_variant_id_idx" ON "Inventory"("sub_variant_id");

-- CreateIndex
CREATE INDEX "Inventory_quantity_idx" ON "Inventory"("quantity");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_product_id_variant_id_sub_variant_id_key" ON "Inventory"("product_id", "variant_id", "sub_variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_token_key" ON "PasswordReset"("token");

-- CreateIndex
CREATE INDEX "PasswordReset_user_id_idx" ON "PasswordReset"("user_id");

-- CreateIndex
CREATE INDEX "PasswordReset_token_idx" ON "PasswordReset"("token");

-- CreateIndex
CREATE INDEX "PasswordReset_expires_at_idx" ON "PasswordReset"("expires_at");

-- CreateIndex
CREATE INDEX "Otp_user_id_idx" ON "Otp"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "TokenBlacklist_token_key" ON "TokenBlacklist"("token");

-- CreateIndex
CREATE INDEX "TokenBlacklist_token_idx" ON "TokenBlacklist"("token");

-- CreateIndex
CREATE INDEX "TokenBlacklist_expires_at_idx" ON "TokenBlacklist"("expires_at");

-- AddForeignKey
ALTER TABLE "BankDetail" ADD CONSTRAINT "BankDetail_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("vendor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorUser" ADD CONSTRAINT "VendorUser_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("vendor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("vendor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubcategoryGroup" ADD CONSTRAINT "SubcategoryGroup_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subcategory" ADD CONSTRAINT "Subcategory_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "SubcategoryGroup"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "Subcategory"("subcategory_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("vendor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductHistory" ADD CONSTRAINT "ProductHistory_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("vendor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubVariant" ADD CONSTRAINT "SubVariant_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "ProductVariant"("variant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "ProductVariant"("variant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttribute" ADD CONSTRAINT "ProductAttribute_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_sub_variant_id_fkey" FOREIGN KEY ("sub_variant_id") REFERENCES "SubVariant"("sub_variant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "ProductVariant"("variant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "otp_cmsuser_fkey" FOREIGN KEY ("user_id") REFERENCES "CmsUser"("cms_user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "otp_vendor_fkey" FOREIGN KEY ("user_id") REFERENCES "Vendor"("vendor_id") ON DELETE CASCADE ON UPDATE CASCADE;
