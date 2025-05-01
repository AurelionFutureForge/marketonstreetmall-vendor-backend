import { NextFunction, Request, Response } from "express";
import { AuthenticatedUserSchema, PaginationSchema, UpdateVendorProfileSchema, warehouseSchema, AddOrUpdateBankDetailsSchema, UploadVendorDocumentsSchema } from "../../validations";
import { VendorAdminService } from "../../service";
import { sendResponse } from "../../utils";
import { VendorSearchQuerySchema } from "../../validations/Vendor/vendorAdmin.schema";
import { VendorService } from "../../service";

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

export const searchVendors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, q, onboarding_completed } = VendorSearchQuerySchema.parse(req.query);
    const response = await VendorAdminService.searchVendors(page, limit, q, onboarding_completed);
    sendResponse(res, response.status, response.success, response.message, response.data);
  } catch (error) {
    next(error);
  }
};

export const uploadVendorDocuments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vendor_id } = AuthenticatedUserSchema.parse(req.params);
    const { documents } = UploadVendorDocumentsSchema.parse(req.body);
    const result = await VendorService.uploadVendorDocuments(vendor_id, documents);
    sendResponse(res, result.status, true, result.message, result.data);
  } catch (err) {
    next(err);
  }
};

export const getVendorDocuments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vendor_id } = AuthenticatedUserSchema.parse(req.params);
    const result = await VendorService.getVendorDocuments(vendor_id);
    sendResponse(res, result.status, true, result.message, result.data);
  } catch (err) {
    next(err);
  }
};