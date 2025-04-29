import { NextFunction, Request, Response } from "express";
import { AuthenticatedUserSchema, UpdateVendorProfileSchema, UploadVendorDocumentsSchema } from "../../validations";
import { VendorService } from "../../service";
import { sendResponse } from "../../utils";

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vendor_id } = AuthenticatedUserSchema.parse(req.user);
    const response = await VendorService.getVendorProfile(vendor_id);
    sendResponse(res, response.status, true, response.message, response.data);
  } catch (error) {
    next(error);
  }
};

export const getVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vendor_id } = AuthenticatedUserSchema.parse(req.user);
    const response = await VendorService.getVendorUserProfile(vendor_id);
    sendResponse(res, response.status, true, response.message, response.data);
  } catch (error) {
    next(error);
  }
};

export const updateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vendor_id } = AuthenticatedUserSchema.parse(req.user);
    const updateData = UpdateVendorProfileSchema.parse(req.body);
    const response = await VendorService.updateVendorProfile(vendor_id, updateData);
    sendResponse(res, response.status, true, response.message, response.data);
  } catch (error) {
    next(error);
  }
};

export const uploadVendorDocuments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vendor_id } = AuthenticatedUserSchema.parse(req.user);
    const { documents } = UploadVendorDocumentsSchema.parse(req.body);
    const result = await VendorService.uploadVendorDocuments(vendor_id, documents);
    sendResponse(res, result.status, true, result.message, result.data);
  } catch (err) {
    next(err);
  }
};

export const getVendorDocuments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vendor_id } = AuthenticatedUserSchema.parse(req.user);
    const result = await VendorService.getVendorDocuments(vendor_id);
    sendResponse(res, result.status, true, result.message, result.data);
  } catch (err) {
    next(err);
  }
};
