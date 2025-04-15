import express, { Router } from 'express';
import { VendorBankDetailController } from '../../../controller/dashboard';
import { checkVendorlRole, verifyVendorToken } from '../../../middleware/roleBasedAuth';
const VendorBankRouter: Router = express.Router();

VendorBankRouter.get('/bank',verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorBankDetailController.getBankDetails);
VendorBankRouter.post('/bank',verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorBankDetailController.addOrUpdateBankDetails);
VendorBankRouter.delete('/bank',verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorBankDetailController.deleteBankDetails);
VendorBankRouter.get('/bank/verification-status',verifyVendorToken, checkVendorlRole(["VENDOR_ADMIN"]), VendorBankDetailController.getBankVerificationStatus);

export default VendorBankRouter;