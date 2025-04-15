import { z } from 'zod';

export const AddProductVariantSchema = z.object({
  product_id: z.string().min(1,'Product ID is required'),
  variantDataArray: z.array(
    z.object({
      variant_title: z.string().min(1,'Variant title is required'),
      variant_value: z.string().min(1,'Variant value is required'),
      sku: z.string().min(1,'SKU is required'),
      variant_price: z.number().optional(),
      variant_discount_price: z.number().optional(),
      is_default: z.boolean().optional(),
      stock_quantity: z.number().optional(),
    }).refine((data) => {
      if (data.variant_discount_price !== undefined) {
        return data.variant_price! > data.variant_discount_price;
      }
      return true;
    }, {
      message: 'Variant price must be greater than discount price',
      path: ['variant_discount_price'],
    })
  ),
});


export const AddProductSubVariantSchema = z.object({
  variant_id: z.string().min(1,'Variant ID is required'),
  subVariantDataArray: z.array(
    z.object({
      sub_variant_title: z.string().min(1,'Sub variant title is required'),
      sub_variant_value: z.string().min(1,'Sub variant value is required'),
      sku: z.string().min(1,'SKU is required'),
      sub_variant_price: z.number(),
      sub_variant_discount: z.number(),
      is_default: z.boolean().optional(),
      stock_quantity: z.number().optional(),
    })
  ),
});