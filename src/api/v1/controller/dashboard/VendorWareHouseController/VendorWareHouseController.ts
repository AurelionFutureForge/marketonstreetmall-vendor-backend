import { Request, Response, NextFunction } from 'express';
import { VendorWareHouseService } from "../../../service/dashboard";
import { AppError } from "../../../middleware/errorHanding";
import { sendResponse } from "../../../utils/sendResponse";
import { z } from 'zod';

const warehouseSchema = z.object({
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().default('India'),
  pincode: z.string().min(4).max(10),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  contact_person: z.string().optional(),
  contact_phone: z.string().optional(),
  is_primary: z.boolean().default(false)
});

const updateWarehouseVerificationSchema = z.object({
  verification_status: z.enum(['PENDING', 'VERIFIED', 'REJECTED'])
});

export const getWarehouse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vendor_id = req.user?.vendor_id;
      if (!vendor_id) throw new AppError('Unauthorized', 401);
  
      const response = await VendorWareHouseService.getWarehouseDetails(vendor_id);
      sendResponse(res, response.status, true, response.message, response.data);
    } catch (err) {
      next(err);
    }
  };
  
  export const addOrUpdateWarehouse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vendor_id = req.user?.vendor_id;
      if (!vendor_id) throw new AppError('Unauthorized', 401);
  
      const parsed = warehouseSchema.parse(req.body);
      const response = await VendorWareHouseService.addOrUpdateWarehouse(vendor_id, parsed);
      sendResponse(res, response.status, true, response.message, response.data);
    } catch (err) {
      next(err);
    }
  };
  
  export const updateWarehouseVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vendor_id = req.user?.vendor_id;
      if (!vendor_id) throw new AppError('Unauthorized', 401);
  
      const parsed = updateWarehouseVerificationSchema.parse(req.body);
      const response = await VendorWareHouseService.updateWarehouseVerificationStatus(vendor_id, parsed);
      sendResponse(res, response.status, true, response.message, response.data);
    } catch (err) {
      next(err);
    }
  };
  
  export const getWarehouseVerificationStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vendor_id = req.user?.vendor_id;
      if (!vendor_id) throw new AppError('Unauthorized', 401);
  
      const response = await VendorWareHouseService.getWarehouseVerificationStatus(vendor_id);
      sendResponse(res, response.status, true, response.message, response.data);
    } catch (err) {
      next(err);
    }
  };