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
exports.NewReservationsAdmController = void 0;
const NewReservationsAdmServices_1 = require("../../Services/reservationAdm/NewReservationsAdmServices");
class NewReservationsAdmController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tower_id } = req.body;
            const newReservationsAdmServices = new NewReservationsAdmServices_1.NewReservationsAdmServices();
            const newReservations = yield newReservationsAdmServices.execute();
            return res.json(newReservations);
        });
    }
}
exports.NewReservationsAdmController = NewReservationsAdmController;
