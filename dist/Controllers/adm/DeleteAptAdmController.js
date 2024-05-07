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
exports.DeleteAptAdmController = void 0;
const DeleteAptAdmServices_1 = require("../../Services/adm/DeleteAptAdmServices");
class DeleteAptAdmController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { apartment_id } = req.body;
            const deleteAptAdmServices = new DeleteAptAdmServices_1.DeleteAptAdmServices();
            const deleteApt = yield deleteAptAdmServices.execute({
                apartment_id
            });
            return res.json(deleteApt);
        });
    }
}
exports.DeleteAptAdmController = DeleteAptAdmController;
