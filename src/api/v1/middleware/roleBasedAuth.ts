import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// import prisma from '../../../../prisma/client/prismaClient';
require("dotenv").config();

interface JwtPayload {
  cms_user_id?: string;
  user_id?: string;
  vendor_id?: string;
  user_role?: string;
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
export const verifyTokenMiddleware = (allowedRoles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
      const secret = process.env.ACCESS_TOKEN_SECRET || "key";
      const decoded = verifyToken(token, secret);

      // Check if user's role is in the allowed roles
      if (!decoded.user_role || !allowedRoles.includes(decoded.user_role)) {
        return res.status(403).json({ 
          message: 'Access denied. Insufficient permissions.',
          allowedRoles,
          userRole: decoded.user_role 
        });
      }

      // Attach user details to the request
      req.user = {
        vendor_user_id: decoded.user_id,
        vendor_id: decoded.vendor_id,
        role: decoded.user_role
      };

      next();
    } catch (err) {
      res.status(400).json({ message: 'Invalid token.' });
    }
  };
};

// Middleware to check user roles
export const checkUserRole = (roles: string[]) => {
  return async (req: any, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(400).json({ message: 'Invalid user.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.',
        requiredRoles: roles,
        userRole: req.user.role
      });
    }

    next();
  };
};

// Usage Examples:
export const VENDOR_ROLES = {
  VENDOR_ADMIN: 'VENDOR_ADMIN',
  PRODUCT_ADMIN: 'PRODUCT_ADMIN'
} as const;

// For vendor routes that allow both roles
export const verifyVendorToken = verifyTokenMiddleware([VENDOR_ROLES.VENDOR_ADMIN, VENDOR_ROLES.PRODUCT_ADMIN]);

// For vendor admin only routes
export const verifyVendorAdminToken = verifyTokenMiddleware([VENDOR_ROLES.VENDOR_ADMIN]);

// For product admin only routes
export const verifyProductAdminToken = verifyTokenMiddleware([VENDOR_ROLES.PRODUCT_ADMIN]);

// Role checking middleware
export const checkVendorRole = (roles: string[]) => checkUserRole(roles);
