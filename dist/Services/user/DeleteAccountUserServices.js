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
exports.DeleteAccountUserServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const bcryptjs_1 = require("bcryptjs");
class DeleteAccountUserServices {
    execute({ id, pass }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || !pass) {
                throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
            }
            const user = yield prisma_1.default.user.findFirst({
                where: {
                    id: id
                }
            });
            if (!user) {
                throw new Error('Usuário inválido.');
            }
            const passIsCorrect = yield (0, bcryptjs_1.compare)(pass, user.pass);
            if (!passIsCorrect) {
                throw new Error('Senha incorreta.');
            }
            const thereWaitList = yield prisma_1.default.waitingList.findFirst({
                where: {
                    user_id: id
                }
            });
            if (thereWaitList) {
                const deleteAllList = yield prisma_1.default.waitingList.deleteMany({
                    where: {
                        user_id: id
                    }
                });
            }
            ;
            const updateTokenStatus = yield prisma_1.default.token.deleteMany({
                where: {
                    user_id: id
                }
            });
            const deleteAccount = yield prisma_1.default.user.delete({
                where: {
                    id: id
                }
            });
        });
    }
}
exports.DeleteAccountUserServices = DeleteAccountUserServices;
