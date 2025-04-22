import prisma from "../../../../../../prisma/client/prismaClient";

export const getWarehouseDetails = async (vendor_id: string) => {
  const warehouse = await prisma.warehouse.findUnique({
    where: { vendor_id }
  });

  return {
    status: 200,
    success: true,
    message: 'Warehouse details fetched successfully',
    data: warehouse
  };
};

export const addOrUpdateWarehouse = async (vendor_id: string, data: any) => {
  const existing = await prisma.warehouse.findUnique({ where: { vendor_id } });

  const warehouse = existing
    ? await prisma.warehouse.update({ where: { vendor_id }, data })
    : await prisma.warehouse.create({ data: { ...data, vendor_id } });

  return {
    status: 201,
    success: true,
    message: `Warehouse ${existing ? 'updated' : 'created'} successfully`,
    data: warehouse
  };
};

export const updateWarehouseVerificationStatus = async (vendor_id: string, status: any) => {
  const dataToUpdate: any = {
    verification_status: status.verification_status,
    verified_at: status.verification_status === 'VERIFIED' ? new Date() : null
  };
  
  const warehouse = await prisma.warehouse.update({
    where: { vendor_id },
    data: dataToUpdate
  });

  return {
    status: 200,
    success: true,
    message: 'Warehouse verification status updated successfully',
    data: warehouse
  };
};

export const getWarehouseVerificationStatus = async (vendor_id: string) => {
  const warehouse = await prisma.warehouse.findUnique({
    where: { vendor_id },
    select: {
      verification_status: true,
      verified_at: true
    }
  });

  return {
    status: 200,
    success: true,
    message: 'Verification status fetched successfully',
    data: warehouse
  };
};