import jwt from "jsonwebtoken";

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export const sendToken = async (user: any): Promise<TokenResponse> => {
  const accessToken = jwt.sign(
    { cms_user_id: user.cms_user_id, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { cms_user_id: user.cms_user_id },
    process.env.RESET_TOKEN_SECRET || 'your-refresh-secret',
    { expiresIn: '7d' }
  );

  return {
    access_token: accessToken,
    refresh_token: refreshToken
  };
};

export const sendTokenCMSUser = async (user: any) => {
  try {
    const accessToken = jwt.sign({ user_id: user.cms_user_id, role: user.role }, process.env.ACCESS_TOKEN || 'key', { expiresIn: '1d' });
    const refreshToken = jwt.sign({ user_id: user.cms_user_id, role: user.role }, process.env.REFRESH_TOKEN || 'key', { expiresIn: '7d' });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  } catch (error) {
    return error
  }
};