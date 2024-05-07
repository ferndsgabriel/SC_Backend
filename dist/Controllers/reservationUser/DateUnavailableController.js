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
exports.DateUnavailableController = void 0;
const DateUnavailableServices_1 = require("../../Services/reservationUser/DateUnavailableServices");
class DateUnavailableController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = req.user_id;
            const dateUnavailableServices = new DateUnavailableServices_1.DateUnavailableServices();
            const dateUnavailable = yield dateUnavailableServices.execute({ user_id });
            return res.json(dateUnavailable);
        });
    }
}
exports.DateUnavailableController = DateUnavailableController;
