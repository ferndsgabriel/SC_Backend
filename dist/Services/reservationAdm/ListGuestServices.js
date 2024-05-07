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
exports.ListGuestServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListGuestServices {
    execute({ reservation_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!reservation_id) {
                throw new Error("Digite a reserva!");
            }
            const listGuest = yield prisma_1.default.reservation.findFirst({
                where: {
                    id: reservation_id,
                },
                select: {
                    id: true,
                    date: true,
                    start: true,
                    finish: true,
                    cleaningService: true,
                    name: true,
                    email: true,
                    phone_number: true,
                    guest: true,
                    apartment: {
                        select: {
                            id: true,
                            numberApt: true,
                            payment: true,
                            user: {
                                select: {
                                    name: true,
                                    lastname: true,
                                    email: true,
                                    phone_number: true
                                }
                            },
                            tower: {
                                select: {
                                    id: true,
                                    numberTower: true
                                }
                            }
                        }
                    }
                }, orderBy: {
                    date: 'asc'
                }
            });
            if (!listGuest) {
                throw new Error('Reserva não encontrada.');
            }
            return listGuest;
        });
    }
}
exports.ListGuestServices = ListGuestServices;
