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
exports.FilterOldReservationsController = void 0;
const FilterOldReservationsServices_1 = require("../../Services/concierge/FilterOldReservationsServices");
class FilterOldReservationsController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const per_page = req.query.per_page;
            const page = req.query.page;
            const filterReservationsServices = new FilterOldReservationsServices_1.FilterOldReservationsServices();
            const response = yield filterReservationsServices.execute({
                per_page,
                page
            });
            return res.json(response);
        });
    }
}
exports.FilterOldReservationsController = FilterOldReservationsController;
