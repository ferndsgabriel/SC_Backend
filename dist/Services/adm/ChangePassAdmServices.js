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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePassAdmServices = void 0;
const crypto_1 = require("crypto");
const prisma_1 = __importDefault(require("../../prisma"));
const bcryptjs_1 = require("bcryptjs");
class ChangePassAdmServices {
    execute({ id, pass, newPass }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || !pass || !newPass) {
                throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
            }
            const adm = yield prisma_1.default.adm.findFirst({
                where: {
                    id: id
                }, select: {
                    dateChangePass: true,
                    pass: true
                }
            });
            if (!adm) {
                throw new Error('User invalido');
            }
            if (pass === newPass) {
                throw new Error('Senha nova igual à antiga.');
            }
            const onDay = new Date();
            if (onDay < adm.dateChangePass) {
                throw new Error('Você já alterou sua senha nos últimos 30 dias.');
            }
            const isMyPass = yield (0, bcryptjs_1.compare)(pass, adm.pass);
            if (!isMyPass) {
                throw new Error('Senha inválida.');
            }
            const passHash = yield (0, bcryptjs_1.hash)(newPass, 8);
            const dateChangePass = new Date();
            dateChangePass.setDate(dateChangePass.getDate() + 30);
            const uuid = (0, crypto_1.randomUUID)();
            const newPassword = yield prisma_1.default.adm.update({
                where: {
                    id: id
                }, data: {
                    pass: passHash,
                    dateChangePass: dateChangePass,
                    sessionToken: uuid
                }
            });
            return ({ ok: true });
        });
    }
}
exports.ChangePassAdmServices = ChangePassAdmServices;
