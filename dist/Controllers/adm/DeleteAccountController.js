"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAccountController = void 0;
const DeleteAccountServices_1 = require("../../Services/adm/DeleteAccountServices");
class DeleteAccountController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.adm_id;
            const { pass } = req.body;
            const deleteAccountServices = new DeleteAccountServices_1.DeleteAccountServices();
            const deleteAccount = yield deleteAccountServices.execute({
                id, pass
            });
            return res.json({ ok: true });
        });
    }
}
exports.DeleteAccountController = DeleteAccountController;
