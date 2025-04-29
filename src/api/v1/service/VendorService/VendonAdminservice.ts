import prisma from "../../../../../prisma/client/prismaClient";

export const getAllVendors = async (page: number = 1, limit: number = 10) => {
    try {
        const skip = (page - 1) * limit;
        
        const vendors = await prisma.vendor.findMany({
            skip,
            take: limit,
            orderBy: {
                created_at: "desc",
            },
            select: {
                name: true,
                business_name: true,
                phone: true,
                email: true,
                onboarding_completed: true,
                commission_rate: true,
                vendor_id: true,
            }
        });

        const totalVendors = await prisma.vendor.count();

        return {
            status: 200,
            success: true,
            message: "Vendors fetched successfully",
            data: {
                vendors,
                pagination: {
                    total_data: totalVendors,
                    total_pages: Math.ceil(totalVendors / limit),
                    current_page: page,
                    per_page: limit,
                },
            },
        };
    } catch (error) {
        throw error;
    }
};

export const getVendorDetails = async (vendor_id: string) => {
    try {
        const vendor = await prisma.vendor.findUnique({
            where: { vendor_id },
            select: {
                password: false,
                created_at: true,
                updated_at: true,
                bank_details: true,
                warehouse: true,
                team: true,
                onboarding_completed: true,
                commission_rate: true,
                phone: true,
                email: true,
                name: true,
                business_name: true,
                legal_name: true,
                gstin: true,
                pan: true,
                role: true,
                vendor_id: true,
            }
        });

        if (!vendor) {
            return {
                status: 404,
                success: false,
                message: "Vendor not found",
            };
        }

        return {
            status: 200,
            success: true,
            message: "Vendor details fetched successfully",
            data: vendor,
        };
    } catch (error) {
        throw error;
    }
};

export const updateVendorProfile = async (vendor_id: string, updateData: any) => {
    try {
        const vendor = await prisma.vendor.findUnique({
            where: { vendor_id },
        });

        if (!vendor) {
            return {
                status: 404,
                success: false,
                message: "Vendor not found",
            };
        }

        const updatedVendor = await prisma.vendor.update({
            where: { vendor_id },
            data: {
                name: updateData.name,
                business_name: updateData.business_name,
                legal_name: updateData.legal_name,
                gstin: updateData.gstin || null,
                pan: updateData.pan || null,
                onboarding_completed: updateData.onboarding_completed || false,
                commission_rate: updateData.commission_rate ?? 0,
                phone: updateData.phone,
                updated_at: new Date(),
            },
            select: {
                name: true,
                business_name: true,
                legal_name: true,
                gstin: true,
                pan: true,
                onboarding_completed: true,
                commission_rate: true,
                phone: true,
                email: true,
                vendor_id: true,
            },
        });

        return {
            status: 200,
            success: true,
            message: "Vendor updated successfully",
            data: updatedVendor,
        };
    } catch (error) {
        throw error;
    }
};

export const deleteVendor = async (vendor_id: string) => {
    try {
        const vendor = await prisma.vendor.findUnique({
            where: { vendor_id },
            include: {
                bank_details: true,
                warehouse: true
            }
        });

        if (!vendor) {
            return {
                status: 404,
                success: false,
                message: "Vendor not found",
                data: null
            };
        }

        if (vendor.bank_details) {
            await prisma.bankDetail.delete({
                where: { vendor_id }
            });
        }

        if (vendor.warehouse) {
            await prisma.warehouse.delete({
                where: { vendor_id }
            });
        }

        await prisma.vendorUser.deleteMany({
            where: { vendor_id }
        });

        await prisma.vendor.delete({
            where: { vendor_id },
        });

        return {
            status: 200,
            success: true,
            message: "Vendor and all related data deleted successfully",
            data: { vendor_id }
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
                is_verified: data.is_verified ?? false,
            },
            create: {
                vendor_id: vendorId,
                account_name: data.account_name,
                account_number: data.account_number,
                ifsc_code: data.ifsc_code,
                bank_name: data.bank_name,
                branch_name: data.branch_name ?? null,
                is_verified: data.is_verified ?? false,
            },
        });
  
        return {
            status: 201,
            success: true,
            message: "Bank details updated successfully",
            data: bank,
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
                updated_at: new Date(),
                verification_status: data.verification_status || "PENDING",
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
                contact_phone: data.contact_phone || null,
                verification_status: data.verification_status || "PENDING",
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
  