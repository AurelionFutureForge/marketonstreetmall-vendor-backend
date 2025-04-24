import prisma from "../../../../../../prisma/client/prismaClient";

export const addVendorUser = async (vendorId: string, userData: any) => {
  try {
    const existingAdminUser = await prisma.vendor.findUnique({
      where: { email: userData.email },
    });

    if (existingAdminUser) {
      return {
        status: 404,
        success: false,
        message: "A user with this email already exists as admin",
      };
    }

    const existingUser = await prisma.vendorUser.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      return {
        status: 404,
        success: false,
        message: "A user with this email already exists",
      };
    }

    const newUser = await prisma.vendorUser.create({
      data: {
        ...userData,
        vendor_id: vendorId,
      },
    });

    return {
      status: 201,
      success: true,
      message: "Vendor user added successfully",
      data: {
        vendor_user_id: newUser.vendor_user_id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getAllVendorUsers = async (vendorId: string) => {
  try {
    const users = await prisma.vendorUser.findMany({
      where: { vendor_id: vendorId },
      select: {
        vendor_user_id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
    });

    return {
      status: 200,
      success: true,
      message: "Vendor users fetched successfully",
      data: users,
    };
  } catch (error) {
    throw error;
  }
};

export const deleteVendorUser = async (
  vendor_id: string,
  vendor_user_id: string
) => {
  try {
    const existingUser = await prisma.vendorUser.findUnique({
      where: { vendor_user_id },
    });

    if (!existingUser || existingUser.vendor_id !== vendor_id) {
      return {
        status: 403,
        success: false,
        message: "You are not authorized to delete this user",
      };
    }

    await prisma.vendorUser.delete({
      where: { vendor_user_id },
    });

    return {
      status: 200,
      success: true,
      message: "Vendor user deleted successfully",
    };
  } catch (error) {
    throw error;
  }
};

export const updateVendorUser = async (
  vendor_id: string,
  vendor_user_id: string,
  updateData: {
    name?: string;
    email?: string;
    role?: "VENDOR_ADMIN" | "PRODUCT_ADMIN";
  }
) => {
  try {
    const existingUser = await prisma.vendorUser.findUnique({
      where: { vendor_user_id },
    });

    if (!existingUser || existingUser.vendor_id !== vendor_id) {
      return {
        status: 403,
        success: false,
        message: "You are not authorized to update this user",
      };
    }

    const updatedUser = await prisma.vendorUser.update({
      where: { vendor_user_id },
      data: {
        ...updateData,
        updated_at: new Date(),
      },
    });

    return {
      status: 200,
      success: true,
      message: "Vendor user updated successfully",
      data: {
        vendor_user_id: updatedUser.vendor_user_id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    };
  } catch (error) {
    throw error;
  }
};
