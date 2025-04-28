import { z } from "zod";

export const VendorSearchQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, {
      message: "Page must be a positive integer.",
    }),
  limit: z
    .string()
    .optional()
    .default("10")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, {
      message: "Limit must be a positive integer.",
    }),
  q: z.string().optional(),
  business_type: z.string().optional(),
});
