import express, { Router } from 'express';
import { VendorBankDetailController } from '../../controller';
import { checkVendorlRole, verifyVendorToken } from '../../middleware/roleBasedAuth';
const VendorBankRouter: Router = express.Router();

VendorBankRouter.get('/', verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorBankDetailController.getBankDetails);
VendorBankRouter.post('/', verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorBankDetailController.addOrUpdateBankDetails);
VendorBankRouter.delete('/', verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorBankDetailController.deleteBankDetails);
VendorBankRouter.get('/verification-status', verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorBankDetailController.getBankVerificationStatus);

export default VendorBankRouter;