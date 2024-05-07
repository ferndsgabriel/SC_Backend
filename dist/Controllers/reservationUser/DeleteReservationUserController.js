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
exports.DeleteReservationUserController = void 0;
const DeleteReservationUserServices_1 = require("../../Services/reservationUser/DeleteReservationUserServices");
class DeleteReservationUserController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reservation_id } = req.body;
            const user_id = req.user_id;
            const deleteReservationUserServices = new DeleteReservationUserServices_1.DeleteReservationUserServices();
            const deleteReservation = yield deleteReservationUserServices.execute({
                reservation_id,
                user_id
            });
            return res.json(deleteReservation);
        });
    }
}
exports.DeleteReservationUserController = DeleteReservationUserController;
