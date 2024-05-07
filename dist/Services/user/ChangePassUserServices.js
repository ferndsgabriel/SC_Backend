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
exports.ChangePassUserServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const bcryptjs_1 = require("bcryptjs");
class ChangePassUserServices {
    execute({ id, pass, newPass }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || !pass || !newPass) {
                throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
            }
            const user = yield prisma_1.default.user.findFirst({
                where: {
                    id: id
                }, select: {
                    dateChangePass: true,
                    pass: true
                }
            });
            if (!user) {
                throw new Error('User invalido');
            }
            if (pass === newPass) {
                throw new Error('Senha nova igual à antiga.');
            }
            const onDay = new Date();
            if (onDay < user.dateChangePass) {
                throw new Error('Você já alterou sua senha nos últimos 30 dias.');
            }
            const isMyPass = yield (0, bcryptjs_1.compare)(pass, user.pass);
            if (!isMyPass) {
                throw new Error('Senha inválida.');
            }
            const passHash = yield (0, bcryptjs_1.hash)(newPass, 8);
            const dateChangePass = new Date();
            dateChangePass.setDate(dateChangePass.getDate() + 30);
            const newPassword = yield prisma_1.default.user.update({
                where: {
                    id: id
                }, data: {
                    pass: passHash,
                    dateChangePass: dateChangePass
                }
            });
            const updateTokenStatus = yield prisma_1.default.token.deleteMany({
                where: {
                    user_id: id
                }
            });
        });
    }
}
exports.ChangePassUserServices = ChangePassUserServices;
