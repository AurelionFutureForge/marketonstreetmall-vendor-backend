import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export const sendTokenCMSUser = async (user: any): Promise<any> => {
  try {
    const payload = {
      user_name: user.name,
      user_id: user.vendor_user_id,
      user_role: user.role,
      type: 'VENDOR',
      vendor_id: user.vendor_id || null,
      vendor_name: user.vendor.vendor_name || null
    }

    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY! } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY! } as jwt.SignOptions
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  } catch (error) {
    return error
  }
};