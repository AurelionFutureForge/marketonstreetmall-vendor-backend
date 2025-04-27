import { Router } from 'express';
import { registerController } from '../../../controller/dashboard/VendorController/VendorAuthController';
import { SuperAdminVendorController } from '../../../controller/dashboard';

const superAdminVendorRouter = Router();

// SuperAdmin Vendor Routes
superAdminVendorRouter.get('/',SuperAdminVendorController.getAllVendors);
superAdminVendorRouter.post('/', registerController);
superAdminVendorRouter.get('/:vendor_id', SuperAdminVendorController.getVendorDetails);
superAdminVendorRouter.put('/:vendor_id', SuperAdminVendorController.updateVendorProfile);
superAdminVendorRouter.put('/bank/:vendor_id', SuperAdminVendorController.updateBankDetails);
superAdminVendorRouter.put('/warehouse/:vendor_id', SuperAdminVendorController.addOrUpdateWarehouse);
superAdminVendorRouter.delete('/:vendor_id', SuperAdminVendorController.deleteVendor);

export default superAdminVendorRouter; 