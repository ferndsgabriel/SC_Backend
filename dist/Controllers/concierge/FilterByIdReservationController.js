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
exports.FilterByIdReservationController = void 0;
const FilterByIdReservationServices_1 = require("../../Services/concierge/FilterByIdReservationServices");
class FilterByIdReservationController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reservation_id = req.query.id;
            const filterByID = new FilterByIdReservationServices_1.FilterByIdReservationServices();
            const response = yield filterByID.execute(reservation_id);
            return res.json(response);
        });
    }
}
exports.FilterByIdReservationController = FilterByIdReservationController;
