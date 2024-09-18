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
exports.ViewDashboardController = void 0;
const ViewDashboardServices_1 = require("../../Services/dashboard/ViewDashboardServices");
class ViewDashboardController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { period } = req.body;
            const viewDashboardServices = new ViewDashboardServices_1.ViewDashboardServices();
            const viewDashBoard = yield viewDashboardServices.execute({
                period
            });
            return res.json(viewDashBoard);
        });
    }
}
exports.ViewDashboardController = ViewDashboardController;
