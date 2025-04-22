import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../../../utils/sendResponse';
import { VendorBankDetailService } from "../../../service/dashboard";
import { AppError } from '../../../middleware/errorHanding';
import { z } from "zod";


const AddOrUpdateBankDetailsSchema = z.object({
    account_name: z.string().min(1, 'Account name is required'),
    account_number: z.string().min(8, 'Account number must be at least 8 digits'),
    ifsc_code: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code'),
    bank_name: z.string().min(1, 'Bank name is required'),
    branch_name: z.string().optional().nullable(),
  });

export const getBankDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendor_id = req.user?.vendor_id;
    if (!vendor_id) throw new AppError('Unauthorized', 401);

    const response = await VendorBankDetailService.getBankDetails(vendor_id);
    sendResponse(res, response.status, true, response.message, response.data);
  } catch (err) {
    next(err);
  }
};

export const addOrUpdateBankDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendor_id = req.user?.vendor_id;
    if (!vendor_id) throw new AppError('Unauthorized', 401);

    const parsedData = AddOrUpdateBankDetailsSchema.parse(req.body);

    const response = await VendorBankDetailService.addOrUpdateBankDetails(vendor_id, parsedData);
    sendResponse(res, response.status, true, response.message, response.data);
  } catch (err) {
    next(err);
  }
};

export const deleteBankDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendor_id = req.user?.vendor_id;
    if (!vendor_id) throw new AppError('Unauthorized', 401);

    const response = await VendorBankDetailService.deleteBankDetails(vendor_id);
    sendResponse(res, response.status, true, response.message, response.data);
  } catch (err) {
    next(err);
  }
};

export const getBankVerificationStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendor_id = req.user?.vendor_id;
    if (!vendor_id) throw new AppError('Unauthorized', 401);

    const response = await VendorBankDetailService.getBankVerificationStatus(vendor_id);
    sendResponse(res, response.status, true, response.message, response.data);
  } catch (err) {
    next(err);
  }
};