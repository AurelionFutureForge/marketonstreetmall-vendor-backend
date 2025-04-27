import prisma from "../../../../../../prisma/client/prismaClient";

export const getWarehouseDetails = async (vendor_id: string) => {
  try {
    const warehouse = await prisma.warehouse.findUnique({
      where: { vendor_id },
    });

    return {
      status: 200,
      success: true,
      message: "Warehouse details fetched successfully",
      data: warehouse,
    };
  } catch (error) {
    throw error;
  }
};


export const updateWarehouseVerificationStatus = async (
  vendor_id: string,
  status: any
) => {
  try {
    const dataToUpdate: any = {
      verification_status: status.verification_status,
      verified_at:
        status.verification_status === "VERIFIED" ? new Date() : null,
    };

    const warehouse = await prisma.warehouse.update({
      where: { vendor_id },
      data: dataToUpdate,
    });

    return {
      status: 200,
      success: true,
      message: "Warehouse verification status updated successfully",
      data: warehouse,
    };
  } catch (error) {
    throw error;
  }
};

export const getWarehouseVerificationStatus = async (vendor_id: string) => {
  try {
    const warehouse = await prisma.warehouse.findUnique({
      where: { vendor_id },
      select: {
        verification_status: true,
        verified_at: true,
      },
    });

    return {
      status: 200,
      success: true,
      message: "Verification status fetched successfully",
      data: warehouse,
    };
  } catch (error) {
    throw error;
  }
};

export const addOrUpdateWarehouse = async (vendorId: string, data: any) => {
  try {
    const warehouse = await prisma.warehouse.upsert({
      where: { vendor_id: vendorId },
      update: {
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country || "India",
        pincode: data.pincode,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        contact_person: data.contact_person || null,
        contact_phone: data.contact_phone || null,
        updated_at: new Date()
      },
      create: {
        vendor_id: vendorId,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country || "India",
        pincode: data.pincode,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        contact_person: data.contact_person || null,
        contact_phone: data.contact_phone || null
      }
    });

    return {
      status: 201,
      success: true,
      message: "Warehouse details updated successfully",
      data: warehouse,
    };
  } catch (error) {
    throw error;
  }
};
