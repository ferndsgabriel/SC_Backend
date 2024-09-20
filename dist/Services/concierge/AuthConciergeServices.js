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
exports.AuthConciergeServices = void 0;
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthConciergeServices {
    execute(cod) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!cod) {
                throw new Error('Código de acesso não enviado.');
            }
            const codCompare = process.env.CONCIERGE_PASS;
            const itsEqual = yield (0, bcryptjs_1.compare)(cod, codCompare);
            const token = (0, jsonwebtoken_1.sign)({}, process.env.AJWT_SECRET, {
                subject: cod,
                expiresIn: '30d',
            });
            if (!itsEqual) {
                throw new Error('Código de acesso inválido.');
            }
            else {
                return token;
            }
        });
    }
}
exports.AuthConciergeServices = AuthConciergeServices;
