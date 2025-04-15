import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../utils/sendResponse";
import { VendorService } from "../../../service/dashboard";
import { AppError } from "../../../middleware/errorHanding";
import { z } from "zod";

const UpdateVendorProfileSchema = z.object({
  gstin: z.string().optional().nullable(),
  pan: z.string().optional().nullable(),
  commission_rate: z.number().min(0, "Commission must be non-negative").optional(),
  phone: z.string().min(10).max(15, "Phone number must be between 10 and 15 digits"),
});

const UploadVendorDocumentsSchema = z.object({
  documents: z.array(
    z.object({
      name: z.string().min(1, "Document name is required"),
      url: z.string().url("Valid URL is required"),
    })
  )
});


export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vendor_id = req.user?.vendor_id;
      if (!vendor_id) {
        throw new AppError("User not authenticated", 401);
      }
      const response = await VendorService.getVendorProfile(vendor_id);
      sendResponse(res, response.status, true, response.message, response.data);
    } catch (error) {
      next(error);
    }
  };

  
  export const updateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vendor_id = req.user?.vendor_id;
      if (!vendor_id) {
        throw new AppError("User not authenticated", 401);
      }
      const updateData = UpdateVendorProfileSchema.parse(req.body);
      const response = await VendorService.updateVendorProfile(vendor_id, updateData);
      sendResponse(res, response.status, true, response.message, response.data);
    } catch (error) {
      next(error);
    }
  };

  export const uploadVendorDocuments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vendor_id = req.user?.vendor_id;
      if (!vendor_id) throw new AppError("User not authenticated", 401);
  
      const { documents } = UploadVendorDocumentsSchema.parse(req.body);
  
      const result = await VendorService.uploadVendorDocuments(vendor_id, documents);
  
      sendResponse(res, result.status, true, result.message, result.data);
    } catch (err) {
      next(err);
    }
  };
  
  export const getVendorDocuments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vendor_id = req.user?.vendor_id;
      if (!vendor_id) throw new AppError("User not authenticated", 401);
  
      const result = await VendorService.getVendorDocuments(vendor_id);
  
      sendResponse(res, result.status, true, result.message, result.data);
    } catch (err) {
      next(err);
    }
  };