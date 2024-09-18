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
exports.ActiveUsersAdmController = void 0;
const ActiveUsersAdmServices_1 = require("../../Services/adm/ActiveUsersAdmServices");
class ActiveUsersAdmController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, accountStatus } = req.body;
            const activeUserServices = new ActiveUsersAdmServices_1.ActiveUsersAdmServices();
            const users = yield activeUserServices.execute({
                id, accountStatus
            });
            return res.json(users);
        });
    }
}
exports.ActiveUsersAdmController = ActiveUsersAdmController;
