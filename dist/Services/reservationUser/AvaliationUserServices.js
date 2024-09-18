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
exports.AvaliationUserServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class AvaliationUserServices {
    execute({ reservation_id, ease, space, time, hygiene }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!reservation_id || ease < 0 || space < 0 || time < 0 || hygiene < 0) {
                throw new Error("Preencha todos os campos");
            }
            if (ease > 5 || space > 5 || time > 5 || hygiene > 5) {
                throw new Error("Avaliação inválida");
            }
            const getReservation = yield prisma_1.default.reservation.findFirst({
                where: {
                    id: reservation_id
                }
            });
            if (!getReservation) {
                throw new Error('Reserva não encontrada.');
            }
            const updateReservation = yield prisma_1.default.reservation.update({
                where: {
                    id: reservation_id
                }, data: {
                    isEvaluated: true,
                }
            });
            const createAvaliation = yield prisma_1.default.avaliations.create({
                data: {
                    reservation_id: reservation_id,
                    ease: ease,
                    hygiene: hygiene,
                    time: time,
                    space: space
                }
            });
            return ({ ok: true });
        });
    }
    ;
}
exports.AvaliationUserServices = AvaliationUserServices;
