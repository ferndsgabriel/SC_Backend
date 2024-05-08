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
exports.RecoveryPassAdmServices = void 0;
const bcryptjs_1 = require("bcryptjs");
const prisma_1 = __importDefault(require("../../prisma"));
const FormatEmail_1 = require("../../utils/FormatEmail");
class RecoveryPassAdmServices {
    execute({ pass, cod, email }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!cod || !pass || !email) {
                throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
            }
            const adm = yield prisma_1.default.adm.findFirst({
                where: {
                    email: (0, FormatEmail_1.FormatEmail)(email),
                },
                select: {
                    codDate: true,
                    codRecovery: true,
                    dateChangePass: true,
                    id: true
                }
            });
            if (!adm) {
                throw new Error("Usuário inválido.");
            }
            const isMyCod = yield (0, bcryptjs_1.compare)(cod, adm.codRecovery);
            if (!isMyCod) {
                throw new Error("Código inválido.");
            }
            const onDay = new Date();
            if (onDay < adm.dateChangePass) {
                throw new Error('Você já alterou sua senha nos últimos 30 dias.');
            }
            const tenMinutesPassed = adm.codDate;
            tenMinutesPassed.setMinutes(tenMinutesPassed.getMinutes() + 10);
            if (onDay >= tenMinutesPassed) {
                throw new Error("Código expirado!");
            }
            const hashPass = yield (0, bcryptjs_1.hash)(pass, 8);
            const dateChangePass = new Date();
            dateChangePass.setDate(dateChangePass.getDate() + 30);
            const updatePass = yield prisma_1.default.adm.update({
                where: {
                    id: adm.id
                }, data: {
                    pass: hashPass,
                    dateChangePass: dateChangePass
                }
            });
            const updateTokenStatus = yield prisma_1.default.token.deleteMany({
                where: {
                    adm_id: adm.id
                }
            });
            return ({
                ok: true
            });
        });
    }
}
exports.RecoveryPassAdmServices = RecoveryPassAdmServices;
