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
exports.DeleteReservationAdmServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const SendEmail_1 = require("../../utils/SendEmail");
class DeleteReservationAdmServices {
    execute({ reservation_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!reservation_id) {
                throw new Error("Digite a reserva.");
            }
            const reservationExist = yield prisma_1.default.reservation.findFirst({
                where: {
                    id: reservation_id
                }, select: {
                    apartment_id: true,
                    date: true,
                    phone_number: true,
                    apartment: {
                        select: {
                            tower_id: true
                        }
                    }
                }
            });
            if (!reservation_id) {
                throw new Error('Reserva não encontrada.');
            }
            const thereAwaitList = yield prisma_1.default.waitingList.findMany({
                where: {
                    date: reservationExist.date,
                    user: {
                        apartment: {
                            id: {
                                not: reservationExist.apartment_id,
                            },
                            tower_id: reservationExist.apartment.tower_id,
                        },
                    },
                },
                select: {
                    user: {
                        select: {
                            email: true,
                        },
                    },
                },
            });
            if (thereAwaitList.length > 0) {
                for (var x = 0; x < thereAwaitList.length; x++) {
                    const awaitListMensagem = `
                    <p>Prezado Morador,</p>
        
                    <p>A reserva que você estava aguardando na lista de espera foi cancelada.</p>
        
                    <p>Essa vaga agora está disponível para agendamento. Não perca a oportunidade de reservá-la!</p>
        
                    <p>Visite nosso sistema de reservas para garantir a data desejada.</p>
        
                    <p>Se precisar de assistência ou tiver alguma dúvida, entre em contato conosco.</p>
        
                    <p>Atenciosamente,<br>
                    SalãoCondo</p>
                `;
                    (0, SendEmail_1.SendEmail)(thereAwaitList[x].user.email, awaitListMensagem);
                }
            }
            const message = `
            <p>Prezado Morador, <p>          

            <p>Informamos que a sua reserva foi cancelada devido ao não pagamento das taxas condominiais. Essa medida foi tomada em conformidade com as políticas do condomínio.</p>

            <p>Se precisar de assistência ou tiver alguma dúvida, entre em contato conosco.</p>

            <p>Atenciosamente,<br>
            SalãoCondo</p>
        `;
            (0, SendEmail_1.SendEmail)(reservationExist.phone_number, message);
            const deleteReservation = yield prisma_1.default.reservation.delete({
                where: {
                    id: reservation_id
                }
            });
            return { ok: true };
        });
    }
}
exports.DeleteReservationAdmServices = DeleteReservationAdmServices;
