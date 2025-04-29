import { NextFunction, Request, Response } from "express";
import { AuthenticatedUserSchema, PaginationSchema, UpdateVendorProfileSchema, warehouseSchema, AddOrUpdateBankDetailsSchema } from "../../validations";
import { VendorAdminService } from "../../service";
import { sendResponse } from "../../utils";

export const getAllVendors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = PaginationSchema.parse(req.query);
    const response = await VendorAdminService.getAllVendors(page, limit);
    sendResponse(res, response.status, true, response.message, response.data);
  } catch (error) {
    next(error);
  }
};

export const getVendorDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vendor_id } = AuthenticatedUserSchema.parse(req.params);
    const response = await VendorAdminService.getVendorDetails(vendor_id);
    sendResponse(res, response.status, true, response.message, response.data);
  } catch (error) {
    next(error);
  }
};

export const updateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { vendor_id } = AuthenticatedUserSchema.parse(req.params);
    const updateData = UpdateVendorProfileSchema.parse(req.body);
    const response = await VendorAdminService.updateVendorProfile(vendor_id, updateData);
    sendResponse(res, response.status, true, response.message, response.data);
  } catch (error) {
    next(error);
  }
};

export const deleteVendor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vendor_id } = AuthenticatedUserSchema.parse(req.params);
    const response = await VendorAdminService.deleteVendor(vendor_id);
    sendResponse(res, response.status, response.success, response.message, response.data);
  } catch (error) {
    next(error);
  }
};

export const updateBankDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vendor_id } = AuthenticatedUserSchema.parse(req.params);
    const parsedData = AddOrUpdateBankDetailsSchema.parse(req.body);
    const response = await VendorAdminService.addOrUpdateBankDetails(vendor_id, parsedData);
    sendResponse(res, response.status, true, response.message, response.data);
  } catch (err) {
    next(err);
  }
};

export const addOrUpdateWarehouse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vendor_id } = AuthenticatedUserSchema.parse(req.params);
    const parsedData = warehouseSchema.parse(req.body);
    const response = await VendorAdminService.addOrUpdateWarehouse(vendor_id, parsedData);
    sendResponse(res, response.status, true, response.message, response.data);
  } catch (err) {
    next(err);
  }
};