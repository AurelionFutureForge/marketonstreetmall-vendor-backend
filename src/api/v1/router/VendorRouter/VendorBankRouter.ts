import express, { Router } from 'express';
import { VendorBankDetailController } from '../../controller';
import { checkVendorRole, verifyVendorToken } from '../../middleware/roleBasedAuth';
const VendorBankRouter: Router = express.Router();

VendorBankRouter.get('/', verifyVendorToken, checkVendorRole(["VENDOR_ADMIN"]), VendorBankDetailController.getBankDetails);
VendorBankRouter.post('/', verifyVendorToken, checkVendorRole(["VENDOR_ADMIN"]), VendorBankDetailController.addOrUpdateBankDetails);
VendorBankRouter.delete('/', verifyVendorToken, checkVendorRole(["VENDOR_ADMIN"]), VendorBankDetailController.deleteBankDetails);
VendorBankRouter.get('/verification-status', verifyVendorToken, checkVendorRole(["VENDOR_ADMIN"]), VendorBankDetailController.getBankVerificationStatus);

export default VendorBankRouter;