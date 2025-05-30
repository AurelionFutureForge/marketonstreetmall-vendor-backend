import { NextFunction, Request, Response } from "express";
import { AuthenticatedUserSchema, PaginationSchema, DeleteVendorUserSchema, UpdateVendorUserSchema, VendorUserSchema } from "../../validations";
import { VendorUserService } from "../../service";
import { sendResponse } from "../../utils";

export const addVendorUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vendor_id } = AuthenticatedUserSchema.parse(req.user);
    const validatedData = VendorUserSchema.parse(req.body);
    const result = await VendorUserService.addVendorUser(vendor_id, validatedData);
    sendResponse(res, result.status, result.success, result.message, result.data);
  } catch (error) {
    next(error);
  }
};

export const getVendorUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vendor_id } = AuthenticatedUserSchema.parse(req.user);
    const { page, limit } = PaginationSchema.parse(req.query);
    const result = await VendorUserService.getAllVendorUsers(page, limit, vendor_id);
    sendResponse(res, result.status, result.success, result.message, result.data);
  } catch (error) {
    next(error);
  }
};

export const deleteVendorUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vendor_id } = AuthenticatedUserSchema.parse(req.user);
    const { vendor_user_id } = DeleteVendorUserSchema.parse(req.body);
    const result = await VendorUserService.deleteVendorUser(vendor_id, vendor_user_id);
    sendResponse(res, result.status, result.success, result.message);
  } catch (error) {
    next(error);
  }
};

export const updateVendorUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vendor_id } = AuthenticatedUserSchema.parse(req.user);
    const parsedData = UpdateVendorUserSchema.parse(req.body);
    const response = await VendorUserService.updateVendorUser(vendor_id, parsedData.vendor_user_id, parsedData);
    sendResponse(res, response.status, response.success, response.message, response.data);
  } catch (error) {
    next(error);
  }
};