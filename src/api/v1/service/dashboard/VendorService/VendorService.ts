import prisma from "../../../../../../prisma/client/prismaClient";


export const getVendorProfile = async (vendorId: string) => {
  const vendor = await prisma.vendor.findUnique({
    where: { vendor_id: vendorId },
    include: {
      bank_details: true,
      warehouse: true
    }
  });
  if (!vendor) {
    throw new Error('Vendor not found');
  }

  return {
    status: 201,
    success: true,
    message: 'Vendor details fetched successfully',
    data: vendor,
  };
};



export const updateVendorProfile = async (
  vendorId: string,
  data: any
) => {
  const updatedVendor = await prisma.vendor.update({
    where: { vendor_id: vendorId },
    data: {
      business_name: data.business_name,
      legal_name: data.legal_name,
      gstin: data.gstin || null,
      pan: data.pan || null,
      commission_rate: data.commission_rate ?? 0,
      email: data.email,
      phone: data.phone,
      updated_at: new Date()
    },
    include: {
      bank_details: true,
      warehouse: true
    }
  });

  return {
    status: 200,
    success: true,
    message: 'Vendor profile updated successfully',
    data: updatedVendor,
  };
};

export const uploadVendorDocuments = async (
  vendorId: string,
  documents: { name: string; url: string }[]
) => {
  const created = await prisma.vendorDocument.createMany({
    data: documents.map((doc) => ({
      vendor_id: vendorId,
      name: doc.name,
      url: doc.url
    }))
  });

  return {
    status: 201,
    success: true,
    message: 'Documents uploaded successfully',
    data: created,
  };
};

// Get all documents for a vendor
export const getVendorDocuments = async (vendorId: string) => {
  const docs = await prisma.vendorDocument.findMany({
    where: { vendor_id: vendorId },
    orderBy: { uploaded_at: 'desc' }
  });

  return {
    status: 200,
    success: true,
    message: 'Vendor documents fetched successfully',
    data: docs,
  };
};