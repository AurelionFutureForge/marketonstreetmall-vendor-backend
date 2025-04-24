import prisma from "../../../../../../prisma/client/prismaClient";

export const getVendorProfile = async (vendorId: string) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { vendor_id: vendorId },
      include: {
        bank_details: true,
        warehouse: true,
      },
    });
    if (!vendor) {
      throw new Error("Vendor not found");
    }

    return {
      status: 201,
      success: true,
      message: "Vendor details fetched successfully",
      data: vendor,
    };
  } catch (error) {
    throw error;
  }
};

export const getVendorUserProfile = async (vendorId: string) => {
  try {
    const vendor = await prisma.vendorUser.findUnique({
      where: { vendor_user_id: vendorId },
    });
    if (!vendor) {
      throw new Error("Vendor not found");
    }

    return {
      status: 201,
      success: true,
      message: "Vendor details fetched successfully",
      data: vendor,
    };
  } catch (error) {
    throw error;
  }
};


export const updateVendorProfile = async (vendorId: string, data: any) => {
  try {
    const updatedVendor = await prisma.vendor.update({
      where: { vendor_id: vendorId },
      data: {
        name: data.name,
        business_name: data.business_name,
        legal_name: data.legal_name,
        gstin: data.gstin || null,
        pan: data.pan || null,
        commission_rate: data.commission_rate ?? 0,
        phone: data.phone,
        updated_at: new Date(),
      },
    });

    return {
      status: 200,
      success: true,
      message: "Vendor profile updated successfully",
      data: updatedVendor,
    };
  } catch (error) {
    throw error;
  }
};

export const uploadVendorDocuments = async (
  vendorId: string,
  documents: { name: string; url: string }[]
) => {
  try {
    const created = await prisma.vendorDocument.createMany({
      data: documents.map((doc) => ({
        vendor_id: vendorId,
        name: doc.name,
        url: doc.url,
      })),
    });

    return {
      status: 201,
      success: true,
      message: "Documents uploaded successfully",
      data: created,
    };
  } catch (error) {
    throw error;
  }
};

// Get all documents for a vendor
export const getVendorDocuments = async (vendorId: string) => {
  try {
    const docs = await prisma.vendorDocument.findMany({
      where: { vendor_id: vendorId },
      orderBy: { uploaded_at: "desc" },
    });

    return {
      status: 200,
      success: true,
      message: "Vendor documents fetched successfully",
      data: docs,
    };
  } catch (error) {
    throw error;
  }
};
