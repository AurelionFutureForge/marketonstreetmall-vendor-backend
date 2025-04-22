import { Request, Response, NextFunction } from 'express';
import { VendorWareHouseService } from "../../../service/dashboard";
import { sendResponse } from "../../../utils/sendResponse";
import { AuthenticatedUserSchema } from '../../../validations/dashboard/Vendor/vendorAuth.schema';
import { updateWarehouseVerificationSchema, warehouseSchema } from '../../../validations/dashboard/Warehouse/Warehouse.schema';

export const getWarehouse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { vendor_id } = AuthenticatedUserSchema.parse(req.user);  
      const response = await VendorWareHouseService.getWarehouseDetails(vendor_id);
      sendResponse(res, response.status, true, response.message, response.data);
    } catch (err) {
      next(err);
    }
  };
  
  export const addOrUpdateWarehouse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { vendor_id } = AuthenticatedUserSchema.parse(req.user);  
      const parsed = warehouseSchema.parse(req.body);
      const response = await VendorWareHouseService.addOrUpdateWarehouse(vendor_id, parsed);
      sendResponse(res, response.status, true, response.message, response.data);
    } catch (err) {
      next(err);
    }
  };
  
  export const updateWarehouseVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { vendor_id } = AuthenticatedUserSchema.parse(req.user);  
      const parsed = updateWarehouseVerificationSchema.parse(req.body);
      const response = await VendorWareHouseService.updateWarehouseVerificationStatus(vendor_id, parsed);
      sendResponse(res, response.status, true, response.message, response.data);
    } catch (err) {
      next(err);
    }
  };
  
  export const getWarehouseVerificationStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { vendor_id } = AuthenticatedUserSchema.parse(req.user);  
      const response = await VendorWareHouseService.getWarehouseVerificationStatus(vendor_id);
      sendResponse(res, response.status, true, response.message, response.data);
    } catch (err) {
      next(err);
    }
  };