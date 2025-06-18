import prisma from "../../../../../prisma/client/prismaClient";
import jwt, { SignOptions } from "jsonwebtoken";
import axios from "axios";
import dotenv from 'dotenv';
import { sendMail } from "../../utils/smtpService";
import bcrypt from 'bcryptjs';
dotenv.config();

type User = {
  vendor_id?: string;
  vendor_user_id?: string;
  name: string;
  password: string;
  email: string;
  role: string;
  onboarding_completed?: boolean;
};

export const getVendorUserByEmail = async (email: string) => {
  return await prisma.vendorUser.findUnique({
    where: { email },
  });
};

export const handleVendorRegister = async (vendorData: {
  name: string;
  business_name: string;
  legal_name: string;
  gstin?: string;
  pan?: string | null;
  commission_rate?: number;
  onboarding_completed?: boolean;
  email: string;
  phone: string;
  password: string;
  role: "VENDOR_ADMIN" | "PRODUCT_ADMIN";
  categories?: { category_id: string; category_name: string }[];
}) => {
  try {
    console.log("vendorData:", vendorData);
    // Check if email exists in VendorUser table
    const existingVendorUser = await prisma.vendorUser.findUnique({
      where: {
        email: vendorData.email,
      },
    });

    if (existingVendorUser) {
      return {
        status: 404,
        success: false,
        message: "Email already exists as product admin or vendor admin",
      };
    }

    // For VENDOR_ADMIN, check if vendor exists with same details
    const orConditions: Array<{ vendor_email?: string; gstin?: string; pan?: string }> = [
      { vendor_email: vendorData.email }
    ];

    // Only check for GSTIN if it's provided (not null/undefined)
    if (vendorData.gstin) {
      orConditions.push({ gstin: vendorData.gstin });
    }

    // Only check for PAN if it's provided (not null/undefined)
    if (vendorData.pan) {
      orConditions.push({ pan: vendorData.pan });
    }
    const existingVendor = await prisma.vendor.findFirst({
      where: {
        OR: orConditions,
      },
    });



    if (existingVendor) {
      return {
        status: 404,
        success: false,
        message: "Vendor already exists with given email, GSTIN, or PAN",
      };
    }

    const newVendor = await prisma.$transaction(async (tx) => {
      const vendor = await tx.vendor.create({
        data: {
          business_name: vendorData.business_name,
          legal_name: vendorData.legal_name,
          gstin: vendorData.gstin,
          pan: vendorData.pan ?? null,
          commission_rate: vendorData.commission_rate ?? 0,
          onboarding_completed: false,
          vendor_email: vendorData.email,
          vendor_phone: vendorData.phone,
          vendor_name: vendorData.name
        },
      });

      const hashedPassword = await bcrypt.hash(vendorData.password, 10);

      const vendorUser = await tx.vendorUser.create({
        data: {
          name: vendorData.name,
          email: vendorData.email,
          password: hashedPassword,
          role: "VENDOR_ADMIN",
          vendor: {
            connect: {
              vendor_id: vendor.vendor_id
            }
          }
        },
      });

      if (vendorData.categories && vendorData.categories.length > 0) {
        // First, check all existing categories
        const existingCategories = await tx.category.findMany({
          where: {
            category_id: {
              in: vendorData.categories.map(cat => cat.category_id)
            }
          }
        });

        // Create a map for quick lookup
        const existingCategoryMap = new Map(
          existingCategories.map(cat => [cat.category_id, cat])
        );

        // Process each category
        await Promise.all(vendorData.categories.map(async (categoryData) => {
          try {
            const response = await axios.post(
              'https://api.streetmallcommerce.com/v1/dashboard/categories-group/',
              {
                category_id: categoryData.category_id,
                name: vendorData.business_name + " " + categoryData.category_name
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                }
              }
            );

            if (response.status === 200 || response.status === 201) {
              let category = existingCategoryMap.get(categoryData.category_id);

              if (category) {
                // Connect existing category to vendor
                await tx.vendor.update({
                  where: { vendor_id: vendor.vendor_id },
                  data: {
                    category: {
                      connect: { id: category.id }
                    }
                  }
                });
              } else {
                // Create new category and connect to vendor
                category = await tx.category.create({
                  data: {
                    category_id: categoryData.category_id,
                    name: categoryData.category_name,
                    is_public: false,
                    vendor: {
                      connect: {
                        vendor_id: vendor.vendor_id
                      }
                    }
                  },
                });
              }

              // Create subcategory group
              await tx.subcategoryGroup.create({
                data: {
                  id: category.id,
                  group_id: response.data.data.group_id,
                  name: response.data.data.name,
                  is_public: true
                },
              });
            }
          } catch (error) {
            console.error('Error creating category group:', error);
          }
        }));
      }

      return { vendor, vendorUser };
    });

    return {
      status: 201,
      success: true,
      message: "Vendor registered successfully",
      data: {
        vendor_id: newVendor.vendor.vendor_id,
        name: newVendor.vendor.vendor_name,
        business_name: newVendor.vendor.business_name,
        email: newVendor.vendor.vendor_email,
        phone: newVendor.vendor.vendor_phone,
        role: newVendor.vendorUser.role,
      },
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const handleLoginVendor = async (email: string, password: string) => {
  try {
    const user = await prisma.vendorUser.findUnique({
      where: { email },
      include: {
        vendor: {
          include: {
            bank_details: true,
            category: true,
            warehouse: true,
            documents: true
          }
        }
      }
    });

    if (!user) {
      return { status: 404, message: "User not found" };
    }

    // Verify password using bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { status: 401, message: "Invalid credentials" };
    }

    if (user.role === 'VENDOR_ADMIN' && !user.vendor?.onboarding_completed) {
      return { status: 401, message: "Vendor not onboarded" };
    }

    // For each category, fetch only subcategory groups that contain the vendor's business name
    const categoriesWithFilteredGroups = await Promise.all(
      user.vendor.category.map(async (category) => {
        const subcategoryGroups = await prisma.subcategoryGroup.findMany({
          where: {
            id: category.id,
            name: {
              contains: user.vendor.business_name
            }
          }
        });

        return {
          ...category,
          subcategory_groups: subcategoryGroups
        };
      })
    );

    const payload = {
      user_name: user.name,
      user_id: user.vendor_user_id,
      user_role: user.role,
      type: 'VENDOR',
      vendor_id: user.vendor_id || null,
      vendor_name: user.vendor.vendor_name || null
    }

    // Generate tokens
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
      status: 200,
      success: true,
      message: "Login successful",
      data: {
        user: {
          vendor_id: user.vendor.vendor_id,
          vendor_user_id: user.vendor_user_id,
          name: user.name,
          email: user.email,
          role: user.role,
          business_name: user.vendor.business_name,
          legal_name: user.vendor.legal_name,
          gstin: user.vendor.gstin,
          pan: user.vendor.pan,
          onboarding_completed: user.vendor.onboarding_completed,
          phone: user.vendor.vendor_phone,
          created_at: user.vendor.created_at,
          updated_at: user.vendor.updated_at,
          bank_details: user.vendor.bank_details,
          category: categoriesWithFilteredGroups,
          warehouse: user.vendor.warehouse,
          documents: user.vendor.documents,
        },
        token_data: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      },
    };
  } catch (error) {
    throw error;
  }
};

export const handleForgotPasswordVendor = async (
  email: string,
  origin: string
) => {
  try {
    const user = await getVendorUserByEmail(email);
    if (!user) {
      return { status: 201, success: false, message: "User not found" };
    }

    const resetToken = jwt.sign(
      { vendor_user_id: user.vendor_user_id },
      process.env.RESET_TOKEN_SECRET || "reset-secret",
      { expiresIn: "15m" }
    );

    // Store reset token in database
    await prisma.passwordReset.create({
      data: {
        user_id: user.vendor_user_id,
        token: resetToken,
        expires_at: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      },
    });

    const resetLink = `${origin}/reset-password/${resetToken}`;
    await sendMail(
      user.email,
      "Reset your password",
      `Click the following link to reset your password: ${resetLink}`
    );

    return {
      status: 200,
      success: true,
      message: "Password reset link sent successfully",
    };
  } catch (error) {
    throw error;
  }
};

export const handleResetPasswordVendor = async (
  token: string,
  newPassword: string
) => {
  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.RESET_TOKEN_SECRET || "reset-secret"
    ) as { vendor_user_id: string };

    // Find the reset token in database
    const resetToken = await prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return {
        status: 404,
        success: false,
        message: "Invalid or expired reset token",
      };
    }

    if (resetToken.expires_at < new Date()) {
      // Delete expired token
      await prisma.passwordReset.delete({
        where: { token },
      });
      return {
        status: 400,
        success: false,
        message: "Reset token has expired",
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.vendorUser.update({
      where: { vendor_user_id: decoded.vendor_user_id },
      data: { password: hashedPassword },
    });

    // Delete used token
    await prisma.passwordReset.delete({
      where: { token },
    });

    return {
      status: 200,
      success: true,
      message: "Password reset successfully",
    };
  } catch (error) {
    throw error;
  }
};

export const handleChangePasswordVendor = async (
  vendor_user_id: string,
  currentPassword: string,
  newPassword: string
) => {
  try {
    // First try to find a vendor user
    const vendorUser = await prisma.vendorUser.findFirst({
      where: {
        vendor_user_id: vendor_user_id
      }
    });

    if (!vendorUser) {
      return {
        status: 404,
        success: false,
        message: "User not found",
        data: vendor_user_id,
      };
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, vendorUser.password);
    if (!isValidPassword) {
      return {
        status: 401,
        success: false,
        message: "Current password is incorrect",
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.vendorUser.update({
      where: { vendor_user_id: vendor_user_id },
      data: { password: hashedPassword },
    });

    return {
      status: 200,
      success: true,
      message: "Password changed successfully",
    };
  } catch (error) {
    throw error;
  }
};

export const handleRefreshTokenVendor = async (refreshToken: string) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as {
      user_id: string;
      vendor_id: string;
      user_role: string;
      type: string;
    };

    // Get user
    const user = await prisma.vendorUser.findUnique({
      where: { vendor_user_id: decoded.user_id },
      include: {
        vendor: {
          include: {
            bank_details: true,
            category: true,
            warehouse: true,
            documents: true
          }
        }
      }
    });

    if (!user) {
      return { status: 404, success: false, message: "User not found" };
    }
    // Generate new access token
    const accessToken = jwt.sign(
      {
        user_name: user.name,
        user_id: user.vendor_user_id,
        user_role: user.role,
        type: 'VENDOR',
        vendor_id: user.vendor_id || null,
        vendor_name: user.vendor.vendor_name || null
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY! } as jwt.SignOptions
    );

    return {
      status: 200,
      success: true,
      message: "Token refreshed successfully",
      data: { access_token: accessToken },
    };
  } catch (error) {
    throw error;
  }
};

export const handleCreateWarehouse = async (
  vendor_id: string,
  warehouseData: {
    service_token: string;
    address_nickname: string;
    address_details: {
      street: string;
      city: string;
      state: string;
      zipcode: string;
      country: string;
    };
    contact_info: {
      name: string;
      phone: string;
      email: string;
      alt_phone?: string;
    };
    pickup_location: string;
    comment?: string;
  }
) => {
  try {
    // First, create warehouse in microservice
    const response = await axios.post(
      'https://api.streetmallcommerce.com/v1/dashboard/warehouses/microservice',
      warehouseData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Failed to create warehouse in microservice');
    }

    const microserviceWarehouse = response.data.data;

    // Then create warehouse in our database
    const warehouse = await prisma.warehouse.create({
      data: {
        warehouse_id: microserviceWarehouse.warehouse_id,
        address: warehouseData.address_details.street,
        city: warehouseData.address_details.city,
        state: warehouseData.address_details.state,
        country: warehouseData.address_details.country,
        pincode: warehouseData.address_details.zipcode,
        contact_person: warehouseData.contact_info.name,
        contact_phone: warehouseData.contact_info.phone,
        verification_status: 'PENDING',
        is_primary: false,
        vendor: {
          connect: {
            vendor_id: vendor_id
          }
        }
      }
    });

    return {
      status: 201,
      success: true,
      message: "Warehouse created successfully",
      data: warehouse
    };

  } catch (error) {
    console.error('Error creating warehouse:', error);
    throw error;
  }
};