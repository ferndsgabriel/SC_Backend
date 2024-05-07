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
exports.WaitListUserService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class WaitListUserService {
    execute({ user_id, date }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!date || !user_id) {
                throw new Error('Digite todos os dados!');
            }
            const userExist = yield prisma_1.default.user.findFirst({
                where: {
                    id: user_id
                }, select: {
                    email: true,
                    phone_number: true,
                    name: true,
                    lastname: true,
                    apartment: {
                        select: {
                            id: true,
                            tower_id: true
                        }
                    }
                }
            });
            if (!userExist) {
                throw new Error('O usuário não existe!');
            }
            const reservationExist = yield prisma_1.default.reservation.findFirst({
                where: {
                    date: date,
                    apartment: {
                        tower_id: userExist.apartment.tower_id
                    }
                }
            });
            if (!reservationExist) {
                throw new Error('A reserva não existe!');
            }
            const noRepeat = yield prisma_1.default.waitingList.findFirst({
                where: {
                    date: date,
                    user_id: user_id
                }
            });
            if (noRepeat) {
                throw new Error('Você já está nesta lista de reserva!');
            }
            const awaitList = yield prisma_1.default.waitingList.create({
                data: {
                    user_id: user_id,
                    date: date
                }
            });
            return awaitList;
        });
    }
}
exports.WaitListUserService = WaitListUserService;
