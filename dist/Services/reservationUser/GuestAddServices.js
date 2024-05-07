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
exports.GuestAddServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class GuestAddServices {
    execute({ reservation_id, guest, user_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!reservation_id || !guest || !user_id) {
                throw new Error('Envie todos os dados');
            }
            const userExist = yield prisma_1.default.user.findFirst({
                where: {
                    id: user_id
                }, select: {
                    apartment_id: true
                }
            });
            if (!userExist) {
                throw new Error('Usuário não encontrado :(');
            }
            const addConvidados = yield prisma_1.default.reservation.update({
                where: {
                    id: reservation_id,
                    apartment_id: userExist.apartment_id
                }, data: {
                    guest: guest
                }
            });
            return addConvidados;
        });
    }
}
exports.GuestAddServices = GuestAddServices;
