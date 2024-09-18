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
exports.CreateAdmController = void 0;
const CreateAdmServices_1 = require("../../Services/adm/CreateAdmServices");
class CreateAdmController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, pass, cod, name, lastname, phone_number } = req.body;
            const createAdmServices = new CreateAdmServices_1.CreateAdmServices();
            const adm = yield createAdmServices.execute({
                email,
                pass,
                name,
                lastname,
                phone_number,
                cod
            });
            return res.json(adm);
        });
    }
}
exports.CreateAdmController = CreateAdmController;
