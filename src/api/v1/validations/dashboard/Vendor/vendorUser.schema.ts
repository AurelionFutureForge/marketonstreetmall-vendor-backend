import { z } from "zod";

export const VendorUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["VENDOR_ADMIN", "PRODUCT_ADMIN"]),
});

export const DeleteVendorUserSchema = z.object({
  vendor_user_id: z.string().uuid({ message: "Invalid vendor user ID" }),
});

export const UpdateVendorUserSchema = z.object({
  vendor_user_id: z.string().uuid({ message: "Invalid vendor user ID" }),
  name: z.string().optional(),
  email: z.string().email().optional(),
  role: z.enum(["VENDOR_ADMIN", "PRODUCT_ADMIN"]).optional(),
});
