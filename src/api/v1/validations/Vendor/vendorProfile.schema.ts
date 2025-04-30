import { z } from "zod";

export const UpdateVendorProfileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  business_name: z.string().optional(),
  legal_name: z.string().optional(),
  gstin: z.string().optional().nullable(),
  pan: z.string().optional().nullable(),
  onboarding_completed: z.boolean().optional(),
  commission_rate: z
    .number()
    .min(0, "Commission must be non-negative")
    .optional(),
  phone: z
    .string()
    .min(10)
    .max(15, "Phone number must be between 10 and 15 digits")
    .optional(),
});

export const UploadVendorDocumentsSchema = z.object({
  documents: z.array(
    z.object({
      name: z.string().min(1, "Document name is required"),
      url: z.string().url("Valid URL is required"),
      type: z.string().optional(),
    })
  ),
});
