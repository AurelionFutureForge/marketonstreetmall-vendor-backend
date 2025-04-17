import { z } from 'zod';

export const UserInputSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.string().min(1, 'Age is required'),
  email: z.string().email('Invalid email format'),
  mobile_number: z.string().min(10, 'Mobile number must be at least 10 digits'),
  address: z.record(z.any()).optional(),
  role: z.enum(['COMPANY', 'ZONAL', 'FRANCHISE_PARTNER', 'DISTRIBUTOR', 'CUSTOMER']),
  parent_id: z.string().optional()
}); 