"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatEmail = void 0;
function FormatEmail(email) {
    const emaillower = email.toLowerCase();
    return emaillower.trim();
}
exports.FormatEmail = FormatEmail;
