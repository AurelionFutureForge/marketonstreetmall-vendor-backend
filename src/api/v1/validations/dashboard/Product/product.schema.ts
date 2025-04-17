import { z } from "zod";

export const GetAllProductsSchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, "Page must be a positive integer")
    .optional()
    .default('1')
    .transform((val) => Math.max(parseInt(val, 10), 1)), // Transform to a positive integer
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a positive integer")
    .optional()
    .default('10')
    .transform((val) => Math.max(parseInt(val, 10), 1)), // Transform to a positive integer
  subcategoryId: z.string().optional(),
});

export const GetProductByIdSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

// export const CreateProductSchema = z.object({
//   product_brand: z.string().min(3, "Brand name is required with min 3 characters").max(100, "Brand name must be less than 100 characters"),
//   product_title: z.string().min(3, "Product title is required with min 3 characters").max(200, "Product title must be less than 200 characters"),
//   description: z.string().min(1, "Description is required").max(1000, "Description must be less than 1000 characters"),
//   product_original_price: z.number().positive("Price must be a positive number"),
//   product_discount_price: z.number().positive("Discount price must be a positive number").optional(),
//   total_stock_count: z.number().int().min(0, "Stock count cannot be negative"),
//   skn: z.string().min(1, "SKU is required").max(50, "SKU must be less than 50 characters"),
//   refund_policy: z.boolean(),
//   free_delivery: z.boolean(),
//   dimensions: z.object({
//     length: z.number().positive("Length must be a positive number"),
//     breadth: z.number().positive("Breadth must be a positive number"),
//     height: z.number().positive("Height must be a positive number"),
//     weight: z.number().positive("Weight must be a positive number"),
//   }),
//   pickup_location: z.string().min(1, "Pickup location is required"),
//   fragile: z.boolean(),
//   approx_cod_cost: z.number().positive("COD cost must be a positive number").optional(),
//   subcategory_id: z.string().min(1),
//   ware_house_id: z.string().min(1),
//   attributes: z.array(
//     z.object({
//       attributes_title: z.string().nonempty('Attribute title is required'),
//       attribute_value: z.object({
//         key: z.string(),
//         value: z.string(),
//       }),
//     })
//   ).optional(),
// }).refine(data => {
//   if (data.product_discount_price !== undefined) {
//     return data.product_original_price > data.product_discount_price;
//   }
//   return true;
// }, {
//   message: "Original price must be greater than discount price",
//   path: ["product_discount_price"], // Pointing to the discount price in case of error
// });


// Shared Schemas
const DimensionsSchema = z.object({
  length: z.number().positive("Length must be a positive number"),
  breadth: z.number().positive("Breadth must be a positive number"),
  height: z.number().positive("Height must be a positive number"),
  weight: z.number().positive("Weight must be a positive number"),
});

const AttributesSchema = z.array(
  z.object({
    attributes_title: z.string().nonempty("Attribute title is required"),
    attribute_value: z.array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    ),
  })
);

// Step-Specific Schemas
const StepSchemas = {
  1: z.object({
    product_brand: z.string().min(3, "Brand name is required with min 3 characters").max(100, "Brand name must be less than 100 characters"),
    product_title: z.string().min(3, "Product title is required with min 3 characters").max(200, "Product title must be less than 200 characters"),
    description: z.string().min(1, "Description is required").max(1000, "Description must be less than 1000 characters"),
    thumbnail_url: z.string().url(),
    product_original_price: z.number().positive("Price must be a positive number"),
    product_discount_price: z.number().positive("Discount price must be a positive number").optional(),
    total_stock_count: z.number().int().min(0, "Stock count cannot be negative"),
    skn: z.string().min(1, "SKU is required").max(50, "SKU must be less than 50 characters"),
    refund_policy: z.boolean(),
    free_delivery: z.boolean(),
    dimensions: DimensionsSchema,
    pickup_location: z.string().min(1, "Pickup location is required"),
    fragile: z.boolean(),
    approx_cod_cost: z.number().positive("COD cost must be a positive number").optional(),
    subcategory_id: z.string().min(1),
    ware_house_id: z.string().min(1),
    attributes: AttributesSchema.optional(),
  }).refine(data => {
    if (data.product_discount_price !== undefined) {
      return data.product_original_price > data.product_discount_price;
    }
    return true;
  }, {
    message: "Original price must be greater than discount price",
    path: ["product_discount_price"], // Pointing to the discount price in case of error
  }),

  2: z.array(
    z.object({
      variant_title: z.string().nonempty("Variant title is required"),
      variant_value: z.string().nonempty("Variant value is required"),
      variant_price: z.number().positive("Variant price must be a positive number"),
      variant_discount_price: z.number().positive("Discount price must be a positive number").optional(),
      sku: z.string().min(1, "SKU is required").max(50, "SKU must be less than 50 characters"),
      stock_quantity: z.number().int().min(0, "Stock quantity cannot be negative"),
    })
  ),

  3: z.array(
    z.object({
      variant_id: z.string().nonempty("Variant ID is required"),
      sub_variants: z
        .array(
          z.object({
            sub_variant_title: z.string().nonempty("Sub-variant title is required"),
            sub_variant_value: z.string().nonempty("Sub-variant value is required"),
            is_default: z.boolean(),
            sub_variant_price: z.number().positive("Sub-variant price must be a positive number"),
            sub_variant_discount: z.number().positive("Discount must be a positive number").optional(),
            sku: z.string().nonempty("SKU is required"),
            stock_quantity: z.number().int().min(0, "Stock quantity must be non-negative"),
          })
        )
        .refine(
          (sub_variants) =>
            sub_variants.filter((sub_variants) => sub_variants.is_default).length <= 1,
          {
            message: "Only one sub-variant can have 'is_default: true'",
            path: ["is_default"], // Highlight the is_default field in case of an error
          }
        ),
    })
  ),

  4: z.array(
    z.object({
      image_url: z.string().url("Image URL must be valid"),
      is_default: z.boolean(),
      variant_id: z.string().optional().nullable()
    })
  ),

  5: z.array(
    z.object({
      inventory_id: z.string().min(0, "Quantity cannot be negative"),
      quantity: z.number().int().min(0, "Quantity cannot be negative"),
      safety_stock: z.number().int().optional(),
      reorder_level: z.number().int().optional(),
      reorder_quantity: z.number().int().optional(),
    })
  ),

  6: z.array(
    z.object({
      commission_id: z.string().uuid("Commission ID is required"),
      company_commission: z.number().positive("Company commission must be a positive number"),
      zonal_commission: z.number().positive("Zonal commission must be a positive number"),
      franchise_commission: z.number().positive("Franchise commission must be a positive number"),
      distributor_commission: z.number().positive("Distributor commission must be a positive number"),
    }).refine(
      (data) =>
        data.company_commission +
          data.zonal_commission +
          data.franchise_commission +
          data.distributor_commission <=
        100,
      {
        message: "The sum of all commission values must not exceed 100",
        path: ["company_commission"], // Adjust path to indicate where the issue lies
      }
    )
  )
};

// Dynamic Schema
export const UpdateProductDetailsSchema = z.object({
  step: z.number().int().min(1).max(6, "Step must be between 1 and 6"),
  data: z.any(),
}).refine(({ step, data }) => {
  const schema = StepSchemas[step as keyof typeof StepSchemas];
  if (!schema) {
    throw new Error(`Validation schema for step ${step} is not defined`);
  }
  schema.parse(data); // Validate the data using the schema for the specific step
  return true;
}, {
  message: "Invalid data for the specified step",
  path: ["data"],
});

export const CreateProductSchema = z.object({
  product_title: z.string()
    .min(3, "Product title is required with at least 3 characters")
    .max(200, "Product title must be less than 200 characters"),
  skn: z.string()
    .min(1, "SKU is required")
    .max(50, "SKU must be less than 50 characters"),
  type_product: z.enum(["SIMPLE", "WITH_VARIANTS", "WITH_SUBVARIANTS"]),
});

export const ProductImageSchema = z.object({
  product_id: z.string().min(1, 'Product ID is required'),
  variant_id: z.string().optional(),
  images: z.array(
    z.object({
      image_url: z.string().url('Invalid URL format for image_url'),
      is_default: z.boolean(),
      variant_id: z.string().optional(),
    })
  )
    .min(1, 'At least one image is required')
    .refine((images) => images.filter(image => image.is_default).length === 1, {
      message: 'Exactly one image must be set as default (is_default: true)',
      path: ['images'], // This points to the 'images' array in the error
    }),
});

export const ProductDeleteSchema = z.object({
  productId: z.string(),
});

export const GetAllProductsWithTrashSchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, "Page must be a positive integer")
    .optional()
    .default('1')
    .transform((val) => Math.max(parseInt(val, 10), 1)),
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a positive integer")
    .optional()
    .default('10')
    .transform((val) => Math.max(parseInt(val, 10), 1)),
});

export const RestoreProductFromTrashSchema = z.object({
  product_id: z.string().min(1, "Product ID is required")
});

export const GetProductHistorySchema = z.object({
  product_id: z.string().min(1, 'Product ID is required'),
});