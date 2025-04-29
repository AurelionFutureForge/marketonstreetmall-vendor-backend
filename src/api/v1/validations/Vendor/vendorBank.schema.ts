import { z } from "zod";

export const AddOrUpdateBankDetailsSchema = z.object({
    account_name: z.string().min(1, 'Account name is required'),
    account_number: z.string().min(8, 'Account number must be at least 8 digits'),
    ifsc_code: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code'),
    bank_name: z.string().min(1, 'Bank name is required'),
    branch_name: z.string().optional().nullable(),
    is_verified: z.boolean().optional().nullable(),
});