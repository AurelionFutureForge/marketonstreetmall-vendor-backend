import prisma from "../../../../../prisma/client/prismaClient";
import axios from 'axios';

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
                vendor_name: true,
                business_name: true,
                vendor_phone: true,
                vendor_email: true,
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
        // Execute both queries in parallel
        const [vendor, vendorUser] = await Promise.all([
            prisma.vendor.findUnique({
                where: { vendor_id },
                select: {
                    created_at: true,
                    updated_at: true,
                    bank_details: true,
                    warehouse: true,
                    team: true,
                    onboarding_completed: true,
                    commission_rate: true,
                    vendor_phone: true,
                    vendor_email: true,
                    vendor_name: true,
                    business_name: true,
                    legal_name: true,
                    gstin: true,
                    pan: true,
                    vendor_id: true,
                }
            }),
            prisma.vendorUser.findFirst({
                where: { vendor_id },
                select: {
                    role: true,
                }
            })
        ]);

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
            data: { ...vendor, ...vendorUser },
        };
    } catch (error) {
        throw error;
    }
};

export const updateVendorProfile = async (vendor_id: string, updateData: any) => {
    console.log("Update Data:", updateData);
    try {
        // First check if email is being updated and validate uniqueness
        if (updateData.email) {
            const existingVendorWithEmail = await prisma.vendor.findFirst({
                where: {
                    vendor_email: updateData.email,
                    NOT: {
                        vendor_id: vendor_id
                    }
                }
            });

            if (existingVendorWithEmail) {
                return {
                    status: 400,
                    success: false,
                    message: "Email already exists for another vendor",
                };
            }
        }

        const vendor = await prisma.vendor.findUnique({
            where: { vendor_id },
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
        if (updateData.business_name && updateData.business_name !== vendor.business_name && vendor.category.length > 0) {
            await Promise.all(vendor.category.map(async (category) => {
                try {
                    const groupId = category.subcategory_groups[0]?.group_id;

                    if (groupId) {
                        const response = await axios.put(
                            `https://api.streetmallcommerce.com/v1/dashboard/categories-group/${groupId}`,
                            {
                                name: `${updateData.business_name} ${category.name}`,
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

        // Create update data object with only the fields that are present in updateData
        const updateFields: any = {
            updated_at: new Date()
        };

        // Only include fields that are present in updateData
        if (updateData.name) updateFields.vendor_name = updateData.name;
        if (updateData.business_name) updateFields.business_name = updateData.business_name;
        if (updateData.legal_name) updateFields.legal_name = updateData.legal_name;
        if ('gstin' in updateData) updateFields.gstin = updateData.gstin || null;
        if ('pan' in updateData) updateFields.pan = updateData.pan || null;
        if ('onboarding_completed' in updateData) updateFields.onboarding_completed = updateData.onboarding_completed;
        if ('commission_rate' in updateData) updateFields.commission_rate = updateData.commission_rate;
        if (updateData.phone) updateFields.vendor_phone = updateData.phone;
        if (updateData.email) updateFields.vendor_email = updateData.email;

        const updatedVendor = await prisma.vendor.update({
            where: { vendor_id },
            data: updateFields,
            select: {
                vendor_name: true,
                business_name: true,
                legal_name: true,
                gstin: true,
                pan: true,
                onboarding_completed: true,
                commission_rate: true,
                vendor_phone: true,
                vendor_email: true,
                vendor_id: true,
            },
        });

        // If email or name is updated, also update it in the VendorUser table
        if (updateData.email || updateData.name) {
            const vendorUserUpdate: any = {};
            if (updateData.email) vendorUserUpdate.email = updateData.email;
            if (updateData.name) vendorUserUpdate.name = updateData.name;

            await prisma.vendorUser.updateMany({
                where: {
                    vendor_id: vendor_id,
                    role: "VENDOR_ADMIN"
                },
                data: vendorUserUpdate
            });
        }

        return {
            status: 200,
            success: true,
            message: "Vendor updated successfully",
            data: updatedVendor,
        };
    } catch (error) {
        console.error("Error updating vendor profile:", error);
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

export const searchVendors = async (page: number = 1, limit: number = 10, search?: string, onboarding_completed?: string) => {
    try {
        const skip = (page - 1) * limit;

        const whereClause: any = {};

        if (onboarding_completed === 'true' || onboarding_completed === 'false') {
            whereClause.onboarding_completed = onboarding_completed === 'true';
        }

        if (search) {
            whereClause.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { business_name: { contains: search, mode: "insensitive" } },
                { vendor_id: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { phone: { contains: search, mode: "insensitive" } },
            ];
        }

        const [vendors, totalVendors] = await prisma.$transaction([
            prisma.vendor.findMany({
                skip,
                take: limit,
                where: whereClause,
                orderBy: {
                    created_at: "desc",
                },
                select: {
                    vendor_name: true,
                    business_name: true,
                    vendor_phone: true,
                    vendor_email: true,
                    onboarding_completed: true,
                    commission_rate: true,
                    vendor_id: true,
                }
            }),
            prisma.vendor.count({
                where: whereClause,
            }),
        ]);

        return {
            status: 200,
            success: true,
            message: "Vendors retrieved successfully",
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