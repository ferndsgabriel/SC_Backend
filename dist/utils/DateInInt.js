"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AddZero_1 = __importDefault(require("./AddZero"));
function dateInInt(date, dayMore) {
    date.setDate(date.getDate() + dayMore);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateConcact = `${(0, AddZero_1.default)(year)}${(0, AddZero_1.default)(month)}${(0, AddZero_1.default)(day)}`;
    return parseInt(dateConcact);
}
exports.default = dateInInt;
