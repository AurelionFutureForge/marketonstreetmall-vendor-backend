import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../../../../prisma/client/prismaClient';
import { AppError } from './errorHanding';

// Middleware to verify JWT token and attach user info to request
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return next(new AppError('No token provided', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'access-secret') as any;
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError('Invalid or expired token', 401));
  }
};

// Middleware to verify vendor authentication
export const authenticateVendor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return next(new AppError('No token provided', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'access-secret') as any;

    // Check if token is blacklisted
    const blacklisted = await prisma.tokenBlacklist.findUnique({
      where: { token }
    });

    if (blacklisted) {
      return next(new AppError('Token has been revoked', 401));
    }

    // Attach vendor info to request
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError('Invalid or expired token', 401));
  }
};

// Middleware to verify superadmin authentication
export const authenticateSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return next(new AppError('No token provided', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'access-secret') as any;

    // Check if token is blacklisted
    const blacklisted = await prisma.tokenBlacklist.findUnique({
      where: { token }
    });

    if (blacklisted) {
      return next(new AppError('Token has been revoked', 401));
    }

    // Check if user is a superadmin
    if (!decoded.role || decoded.role !== 'SUPER_ADMIN') {
      return next(new AppError('Access denied: Not authorized as superadmin', 403));
    }

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return next(new AppError('Invalid or expired token', 401));
  }
}; 