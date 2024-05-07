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
exports.ListTowersUserController = void 0;
const ListTowersAdmServices_1 = require("../../Services/user/ListTowersAdmServices");
class ListTowersUserController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const listTowersUsersServices = new ListTowersAdmServices_1.ListTowersUsersServices();
            const listTowers = yield listTowersUsersServices.execute();
            return res.json(listTowers);
        });
    }
}
exports.ListTowersUserController = ListTowersUserController;
