import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { AuthenticatedUserSchema, PaginationSchema } from "../../../validations/dashboard/Vendor/vendorAuth.schema";
import { UpdateVendorProfileSchema } from "../../../validations/dashboard/Vendor/vendorProfile.schema";
import { VendorSuperAdminService, VendorWareHouseService } from "../../../service/dashboard";
import { AddOrUpdateBankDetailsSchema } from "../../../validations/dashboard";
import { warehouseSchema } from "../../../validations/dashboard/Warehouse/Warehouse.schema";
import { VendorSearchQuerySchema } from "../../../validations/dashboard/Vendor/vendorAdmin.schema";

export const getAllVendors = async (req: Request,  res: Response,  next: NextFunction) => {
  try {
    const { page, limit } = PaginationSchema.parse(req.query);
    const response = await VendorSuperAdminService.getAllVendors(page, limit);
    sendResponse(res, response.status, true, response.message, response.data);
  } catch (error) {
    next(error);
  }
};

export const getVendorDetails = async (  req: Request,  res: Response, next: NextFunction) => {
  try {
    const { vendor_id } = AuthenticatedUserSchema.parse(req.params);
    const response = await VendorSuperAdminService.getVendorDetails(vendor_id);
    sendResponse(res, response.status, true, response.message, response.data);
  } catch (error) {
    next(error);
  }
};

export const updateVendorProfile = async (  req: Request,  res: Response,  next: NextFunction) => {
  try {
    
    const { vendor_id } = AuthenticatedUserSchema.parse(req.params);
    const updateData = UpdateVendorProfileSchema.parse(req.body);
    const response = await VendorSuperAdminService.updateVendorProfile(vendor_id, updateData);
    sendResponse(res, response.status, true, response.message, response.data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteVendor = async (  req: Request,  res: Response,  next: NextFunction) => {
  try {
    const { vendor_id } = AuthenticatedUserSchema.parse(req.params);
    const response = await VendorSuperAdminService.deleteVendor(vendor_id);
    sendResponse(res, response.status, response.success, response.message, response.data);
  } catch (error) {
    next(error);
  }
}; 

export const updateBankDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vendor_id } = AuthenticatedUserSchema.parse(req.params);
    const parsedData = AddOrUpdateBankDetailsSchema.parse(req.body);
    const response = await VendorSuperAdminService.addOrUpdateBankDetails(vendor_id, parsedData);
    sendResponse(res, response.status, true, response.message, response.data);
  } catch (err) {
    next(err);
  }
};

export const addOrUpdateWarehouse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vendor_id } = AuthenticatedUserSchema.parse(req.params);  
    const parsedData = warehouseSchema.parse(req.body);
    const response = await VendorSuperAdminService.addOrUpdateWarehouse(vendor_id, parsedData);
    sendResponse(res, response.status, true, response.message, response.data);
  } catch (err) {
    next(err);
  }
};

export const searchVendors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, q, business_type } = VendorSearchQuerySchema.parse(req.query);
    const response = await VendorSuperAdminService.searchVendors(page, limit, q, business_type);
    sendResponse(res, response.status, response.success, response.message, response.data);
  } catch (error) {
    next(error);
  }
};