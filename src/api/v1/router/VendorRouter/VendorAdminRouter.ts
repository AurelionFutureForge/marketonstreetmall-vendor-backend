import { Router } from 'express';
import { VendorAdminController, VendorAuthController } from '../../controller';

const VendorAdminRouter = Router();

VendorAdminRouter.get('/', VendorAdminController.getAllVendors);
VendorAdminRouter.post('/', VendorAuthController.registerController);
VendorAdminRouter.get('/:vendor_id/details', VendorAdminController.getVendorDetails);
VendorAdminRouter.put('/:vendor_id', VendorAdminController.updateVendorProfile);
VendorAdminRouter.put('/:vendor_id/bank', VendorAdminController.updateBankDetails);
VendorAdminRouter.put('/:vendor_id/warehouse', VendorAdminController.addOrUpdateWarehouse);
VendorAdminRouter.get('/search', VendorAdminController.searchVendors);
VendorAdminRouter.put('/:vendor_id/documents', VendorAdminController.uploadVendorDocuments);
VendorAdminRouter.get('/:vendor_id/documents', VendorAdminController.getVendorDocuments);

export default VendorAdminRouter; 