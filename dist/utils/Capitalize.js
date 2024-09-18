"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Capitalize = void 0;
function Capitalize(e) {
    const Upper = e[0].toUpperCase();
    const Split = e.substring(1).toLowerCase();
    const result = `${Upper}${Split}`;
    return result.trim();
}
exports.Capitalize = Capitalize;
