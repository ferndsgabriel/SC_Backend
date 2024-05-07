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
exports.SetNewReservationServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const SendEmail_1 = require("../../utils/SendEmail");
class SetNewReservationServices {
    execute({ reservation_id, status }) {
        return __awaiter(this, void 0, void 0, function* () {
            const idReservation = yield prisma_1.default.reservation.findFirst({
                where: {
                    id: reservation_id
                },
                select: {
                    start: true,
                    finish: true,
                    date: true,
                    apartment: {
                        select: {
                            id: true,
                            tower_id: true
                        },
                    },
                }
            });
            if (!idReservation) {
                throw new Error('Reserva não encontrada.');
            }
            ;
            const existOther = yield prisma_1.default.reservation.findFirst({
                where: {
                    reservationStatus: true,
                    date: idReservation.date,
                    apartment: {
                        tower_id: idReservation.apartment.tower_id
                    },
                    finish: {
                        gte: idReservation.start
                    }
                }
            });
            if (existOther && status !== false) {
                throw new Error('Você já aprovou uma reserva nessa data.');
            }
            ;
            const activeAgendamento = yield prisma_1.default.reservation.update({
                where: {
                    id: reservation_id
                }, data: {
                    reservationStatus: status
                }
            });
            let message = '';
            if (status) {
                message = 'SalãoCondo, sobre sua reserva do salão: Oba! Com grande alegria, informamos que sua reserva foi aceita com sucesso! Agora você pode preencher a lista de convidados para o evento. Temos certeza de que será uma ocasião especial e estamos ansiosos para recebê-lo juntamente com seus convidados.';
            }
            else {
                message = 'SalãoCondo, sobre sua reserva do salão: Lamentamos informar que não podemos aceitar a sua reserva neste momento. Pedimos desculpas pela inconveniência que isso possa causar.';
            }
            const usersInApartment = yield prisma_1.default.user.findMany({
                where: {
                    apartment_id: idReservation.apartment.id
                }, select: {
                    email: true,
                }
            });
            const lenghtUsers = usersInApartment.length;
            for (var x = 0; x < lenghtUsers; x++) {
                (0, SendEmail_1.SendEmail)(usersInApartment[x].email, message);
            }
            const deleteAllFalse = yield prisma_1.default.reservation.deleteMany({
                where: {
                    reservationStatus: false
                }
            });
            return activeAgendamento;
        });
    }
}
exports.SetNewReservationServices = SetNewReservationServices;
