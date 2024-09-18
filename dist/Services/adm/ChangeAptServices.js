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
exports.ChangeAptServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ChangeAptServices {
    execute({ apartment_id, user_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!apartment_id || !user_id) {
                throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
            }
            const userExist = yield prisma_1.default.user.findFirst({
                where: {
                    id: user_id
                }
            });
            if (!userExist) {
                throw new Error('O usuário não foi encontrado.');
            } // se não existe user...
            const aptExist = yield prisma_1.default.apartment.findFirst({
                where: {
                    id: apartment_id
                }
            });
            if (!aptExist) {
                throw new Error('Apartamento inexistente.');
            } // se não existe user...
            const updateApt = yield prisma_1.default.user.update({
                where: {
                    id: user_id
                },
                data: {
                    apartment_id: apartment_id
                }
            }); // se existe vou poder atualizar 
            return updateApt;
        });
    }
}
exports.ChangeAptServices = ChangeAptServices;
