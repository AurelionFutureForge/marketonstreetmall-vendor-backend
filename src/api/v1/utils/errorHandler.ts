import { Response } from 'express';

export const handleError = (res: Response, error: any) => {
  console.error('Error:', error);
  
  // Check if error has a status code (custom error)
  if (error.status) {
    return res.status(error.status).json({
      success: false,
      message: error.message || 'An error occurred',
    });
  }
  
  // Default error response
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
}; 