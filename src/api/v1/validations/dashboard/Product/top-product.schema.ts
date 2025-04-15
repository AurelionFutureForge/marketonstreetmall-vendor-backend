import { z } from "zod";

/**
 * Schema for searching top products by query.
 */
export const SearchTopProductsQuerySchema = z.object({
  q: z.string().min(1, "Search query is required").optional(),
  page: z.string().optional().default("1").transform(Number),
  limit: z.string().optional().default("10").transform(Number),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  is_public: z.string().optional().transform((val) => (val ? val === "true" : undefined)),
});

/**
 * Schema for pagination in top products.
 */
export const TopProductPaginationSchema = z.object({
  page: z.string().optional().default("1").transform(Number),
  limit: z.string().optional().default("10").transform(Number),
});

/**
 * Schema for creating a new top product.
 */
export const TopProductInputSchema = z.object({
  product_ids: z.array(z.string().uuid("Invalid product ID")),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(), // Adjust based on your `TopProductType` enum
  is_public: z.boolean().optional(),
  priority: z.number().int().nonnegative().optional(),
});

/**
 * Schema for updating a top product.
 */
export const TopProductUpdateSchema = z.array(
  z.object({
    top_product_id: z.string().uuid("Invalid top product ID"),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
    is_public: z.boolean().optional(),
    priority: z.number().int().nonnegative().optional(),
  })
);

/**
 * Schema for deleting a top product.
 */
export const TopProductDeleteSchema = z.object({
  top_product_id: z.string().uuid("Invalid top product ID"),
});

/**
 * Schema for filtering top products.
 */
export const FilterTopProductQuerySchema = z.object({
  is_public: z.boolean().optional(),
  priority: z.number().int().nonnegative().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().optional().default(10),
});
