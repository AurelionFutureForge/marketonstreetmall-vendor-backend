import { Router } from 'express';
import { VendorAdminController, VendorAuthController } from '../../controller';

const VendorAdminRouter = Router();

VendorAdminRouter.get('/vendors', VendorAdminController.getAllVendors);
VendorAdminRouter.post('/vendors', VendorAuthController.registerController);
VendorAdminRouter.get('/vendors/:vendor_id', VendorAdminController.getVendorDetails);
VendorAdminRouter.put('/vendors/:vendor_id', VendorAdminController.updateVendorProfile);
VendorAdminRouter.delete('/vendors/:vendor_id', VendorAdminController.deleteVendor);
VendorAdminRouter.put('/vendors/:vendor_id/bank', VendorAdminController.updateBankDetails);
VendorAdminRouter.put('/vendors/:vendor_id/warehouse', VendorAdminController.addOrUpdateWarehouse);

export default VendorAdminRouter; 