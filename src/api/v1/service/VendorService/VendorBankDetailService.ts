import prisma from "../../../../../prisma/client/prismaClient";

export const getBankDetails = async (vendorId: string) => {
  try {
    const bank = await prisma.bankDetail.findUnique({
      where: { vendor_id: vendorId },
    });

    return {
      status: 200,
      success: true,
      message: "Bank details fetched successfully",
      data: bank,
    };
  } catch (error) {
    throw error;
  }
};

export const addOrUpdateBankDetails = async (vendorId: string, data: any) => {
  try {
    const bank = await prisma.bankDetail.upsert({
      where: { vendor_id: vendorId },
      update: {
        account_name: data.account_name,
        account_number: data.account_number,
        ifsc_code: data.ifsc_code,
        bank_name: data.bank_name,
        branch_name: data.branch_name ?? null,
        updated_at: new Date(),
      },
      create: {
        vendor_id: vendorId,
        account_name: data.account_name,
        account_number: data.account_number,
        ifsc_code: data.ifsc_code,
        bank_name: data.bank_name,
        branch_name: data.branch_name ?? null,
      },
    });

    return {
      status: 201,
      success: true,
      message: "Bank details added/updated successfully",
      data: bank,
    };
  } catch (error) {
    throw error;
  }
};

export const deleteBankDetails = async (vendorId: string) => {
  try {
    await prisma.bankDetail.delete({
      where: { vendor_id: vendorId },
    });

    return {
      status: 200,
      success: true,
      message: "Bank details deleted successfully",
      data: null,
    };
  } catch (error) {
    throw error;
  }
};

export const getBankVerificationStatus = async (vendorId: string) => {
  try {
    const bank = await prisma.bankDetail.findUnique({
      where: { vendor_id: vendorId },
      select: { is_verified: true },
    });

    return {
      status: 200,
      success: true,
      message: "Bank verification status fetched successfully",
      data: bank,
    };
  } catch (error) {
    throw error;
  }
};
