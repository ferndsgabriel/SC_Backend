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
exports.RecoveryPassUserServices = void 0;
const bcryptjs_1 = require("bcryptjs");
const prisma_1 = __importDefault(require("../../prisma"));
const FormatEmail_1 = require("../../utils/FormatEmail");
class RecoveryPassUserServices {
    execute({ pass, cod, email }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!cod || !pass || !email) {
                throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
            }
            const user = yield prisma_1.default.user.findFirst({
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
            if (!user) {
                throw new Error("Usuário inválido.");
            }
            const isMyCod = yield (0, bcryptjs_1.compare)(cod, user.codRecovery);
            if (!isMyCod) {
                throw new Error("Código inválido.");
            }
            const onDay = new Date();
            if (onDay < user.dateChangePass) {
                throw new Error('Você já alterou sua senha nos últimos 30 dias.');
            }
            const moreTeenMinutes = new Date();
            const moreTenMinutes = new Date();
            moreTenMinutes.setTime(moreTenMinutes.getTime() + 10 * 60 * 1000);
            if (user.codDate <= moreTeenMinutes) {
                const updateRecovery = yield prisma_1.default.user.update({
                    where: {
                        email: (0, FormatEmail_1.FormatEmail)(email),
                    }, data: {}
                });
                throw new Error("Código expirado!");
            }
            const hashPass = yield (0, bcryptjs_1.hash)(pass, 8);
            const dateChangePass = new Date();
            dateChangePass.setDate(dateChangePass.getDate() + 30);
            const updatePass = yield prisma_1.default.user.update({
                where: {
                    id: user.id
                }, data: {
                    pass: hashPass,
                    dateChangePass: dateChangePass
                }
            });
            const updateTokenStatus = yield prisma_1.default.token.deleteMany({
                where: {
                    user_id: user.id
                }
            });
            return ({
                ok: true
            });
        });
    }
}
exports.RecoveryPassUserServices = RecoveryPassUserServices;
