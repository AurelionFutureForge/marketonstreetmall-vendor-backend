import { Request } from 'express';

export declare global {
  namespace Express {
    interface Request {
      user?: {
        cms_user_id?: string;
        vendor_id?: string;
        role: string;
      };
    }
  }
}