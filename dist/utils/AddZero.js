"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function AddZero(number) {
    let num = parseInt(number.toString(), 10);
    if (isNaN(num)) {
        throw new Error("Invalid input: not a number");
    }
    if (num <= 9) {
        return `0${num}`;
    }
    else {
        return num.toString();
    }
}
exports.default = AddZero;
