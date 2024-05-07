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
exports.DeleteAccountServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const bcryptjs_1 = require("bcryptjs");
class DeleteAccountServices {
    execute({ id, pass }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || !pass) {
                throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
            }
            const adm = yield prisma_1.default.adm.findFirst({
                where: {
                    id: id
                }
            });
            if (!adm) {
                throw new Error('Usuário inválido.');
            }
            const isMyPass = yield (0, bcryptjs_1.compare)(pass, adm.pass);
            if (!isMyPass) {
                throw new Error('Senha incorreta.');
            }
            const allTokens = yield prisma_1.default.token.findMany({
                where: {
                    adm_id: id
                }
            });
            const updateTokenStatus = yield prisma_1.default.token.deleteMany({
                where: {
                    adm_id: id
                }
            });
            const deleteAdm = yield prisma_1.default.adm.delete({
                where: {
                    id: id
                }
            });
        });
    }
}
exports.DeleteAccountServices = DeleteAccountServices;
