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
exports.AuthConciergeController = void 0;
const AuthConciergeServices_1 = require("../../Services/concierge/AuthConciergeServices");
class AuthConciergeController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cod } = req.body;
            const authConciergeServices = new AuthConciergeServices_1.AuthConciergeServices();
            const response = yield authConciergeServices.execute(cod);
            return res.json(response);
        });
    }
}
exports.AuthConciergeController = AuthConciergeController;
