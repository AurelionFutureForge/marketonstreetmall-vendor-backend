import { z } from 'zod';

export const warehouseSchema = z.object({
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().default('India'),
  pincode: z.string().min(4).max(10),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  contact_person: z.string().optional(),
  contact_phone: z.string().optional(),
  is_primary: z.boolean().default(false),
  verification_status: z.enum(['PENDING', 'VERIFIED', 'REJECTED']).optional(),
});

export const updateWarehouseVerificationSchema = z.object({
  verification_status: z.enum(['PENDING', 'VERIFIED', 'REJECTED'])
});
