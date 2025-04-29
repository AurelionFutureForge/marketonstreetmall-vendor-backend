import { Request, Response, NextFunction } from 'express';
import { AddOrUpdateBankDetailsSchema } from '../../validations';
import { VendorBankDetailService } from "../../service";
import { sendResponse } from '../../utils';
import { AppError } from '../../middleware';

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