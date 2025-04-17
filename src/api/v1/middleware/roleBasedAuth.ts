import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// import prisma from '../../../../prisma/client/prismaClient';
require("dotenv").config();

interface JwtPayload {
  cms_user_id?: string;
  user_id?: string;
  vendor_id?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

// Utility function to verify a JWT token
const verifyToken = (token: string, secret: string): JwtPayload => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (err) {
    throw new Error('Invalid token.');
  }
};

// Middleware to verify JWT token
export const verifyTokenMiddleware = (userType: 'vendor' | 'cms') => {
  return (req: any, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
      const secret = process.env.JWT_SECRET || "key";
      const decoded = verifyToken(token, secret);

      // Attach user details to the request based on user type
      req.user = userType === 'cms'
        ? { cms_user_id: decoded.cms_user_id || decoded.user_id, role: decoded.role }
        : {vendor_id : decoded.vendor_id};

      next();
    } catch (err) {
      res.status(400).json({ message: 'Invalid token.' });
    }
  };
};

// Middleware to check user roles
export const checkUserRole = (roles: string[], userType: 'vendor' | 'cms') => {
  return async (req: any, res: Response, next: NextFunction) => {
    const userId = userType === 'cms' ? req.user.cms_user_id : req.user.vendor_id;

    if (!userId) {
      return res.status(400).json({ message: 'Invalid user.' });
    }

    // Replace the following block with a database query to fetch the user's role
    // const user = userType === 'cms'
    //   ? await prisma.cmsUser.findUnique({ where: { cms_user_id: userId } })
    //   : await prisma.user.findUnique({ where: { user_id: userId } });

    // if (!user || !roles.includes(user.role)) {
    //   return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    // }

    next();
  };
};

// Usage Examples:

// For CMS user token verification
export const verifyCMSToken = verifyTokenMiddleware('cms');

export const verifyVendorToken = verifyTokenMiddleware('vendor');

// For normal user role checking
export const checkVendorlRole = (roles: string[]) => checkUserRole(roles, 'vendor');

// For CMS user role checking
export const checkCMSRole = (roles: string[]) => checkUserRole(roles, 'cms');
