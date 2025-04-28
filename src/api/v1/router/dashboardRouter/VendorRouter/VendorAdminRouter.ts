import { Router } from 'express';
import { registerController } from '../../../controller/dashboard/VendorController/VendorAuthController';
import { SuperAdminVendorController } from '../../../controller/dashboard';

const superAdminVendorRouter = Router();

// SuperAdmin Vendor Routes
superAdminVendorRouter.get('/superadmin/vendor/',SuperAdminVendorController.getAllVendors);
superAdminVendorRouter.post('/superadmin/vendor/', registerController);
superAdminVendorRouter.get('/superadmin/vendor/:vendor_id', SuperAdminVendorController.getVendorDetails);
superAdminVendorRouter.put('/superadmin/vendor/:vendor_id', SuperAdminVendorController.updateVendorProfile);
superAdminVendorRouter.put('/superadmin/vendor/bank/:vendor_id', SuperAdminVendorController.updateBankDetails);
superAdminVendorRouter.put('/superadmin/vendor/warehouse/:vendor_id', SuperAdminVendorController.addOrUpdateWarehouse);
superAdminVendorRouter.delete('/superadmin/vendor/:vendor_id', SuperAdminVendorController.deleteVendor);

export default superAdminVendorRouter; 