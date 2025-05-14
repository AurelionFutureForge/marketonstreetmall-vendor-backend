import prisma from "../../../../../prisma/client/prismaClient";
import axios from 'axios';

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
    const vendor = await prisma.vendor.findUnique({
      where: { vendor_id: vendorId },
      include: {
        warehouse: true,
      },
    });
    if (!vendor) {
      return {
        status: 402,
        success: false,
        message: "Vendor not found"
      };
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
    const vendor = await prisma.vendor.findUnique({
      where: { vendor_id: vendorId },
      include: {
        category: {
          select: {
            name: true,
            category_id: true,
            subcategory_groups: {
              select: {
                name: true,
                group_id: true,
              }
            }
          }
        }
      }
    });

    if (!vendor) {
      return {
        status: 404,
        success: false,
        message: "Vendor not found",
      };
    }

    // If business name is changing and there are categories, update them in external API
    if (data.business_name && data.business_name !== vendor.business_name && vendor.category.length > 0) {
      await Promise.all(vendor.category.map(async (category) => {
        try {
          const groupId = category.subcategory_groups[0]?.group_id;
          console.log(groupId);
          if (groupId) {
            const response = await axios.put(
              `https://api.streetmallcommerce.com/v1/dashboard/categories-group/${groupId}`,
              {
                name: `${data.business_name} ${category.name}`,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                }
              }
            );

            if (response.status === 200 || response.status === 201) {
              await prisma.subcategoryGroup.update({
                where: {
                  group_id: groupId
                },
                data: {
                  name: response.data.data.name
                }
              });
            }
          }
        } catch (error) {
          console.error(`Failed to update category group for category ${category.category_id}:`, error);
        }
      }));
    }

    const updatedVendor = await prisma.vendor.update({
      where: { vendor_id: vendorId },
      data: {
        vendor_name: data.name,
        business_name: data.business_name,
        legal_name: data.legal_name,
        gstin: data.gstin || null,
        pan: data.pan || null,
        commission_rate: data.commission_rate ?? 0,
        vendor_phone: data.phone,
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
  documents: { name: string; url: string; type?: string }[]
) => {
  try {
    const created = await prisma.vendorDocument.createMany({
      data: documents.map((doc) => ({
        vendor_id: vendorId,
        name: doc.name,
        url: doc.url,
        type: doc.type || null,
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
