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
exports.DeleteReservationUserServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const SendEmail_1 = require("../../utils/SendEmail");
class DeleteReservationUserServices {
    execute({ reservation_id, user_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!reservation_id || !user_id) {
                throw new Error('Digite todos os dados!');
            }
            const user = yield prisma_1.default.user.findFirst({
                where: {
                    id: user_id
                },
                select: {
                    name: true,
                    lastname: true,
                    phone_number: true,
                    email: true,
                    apartment: {
                        select: {
                            numberApt: true,
                            id: true,
                            tower: {
                                select: {
                                    numberTower: true,
                                    id: true,
                                }
                            }
                        },
                    }
                }
            });
            if (!user) {
                throw new Error('O usuário não existe!');
            }
            const reservationExist = yield prisma_1.default.reservation.findFirst({
                where: {
                    id: reservation_id,
                    apartment_id: user.apartment.id
                }, select: {
                    date: true,
                    reservationStatus: true
                }
            });
            if (!reservationExist) {
                throw new Error('Essa reserva não existe!');
            }
            const onDayMoreTwo = new Date();
            onDayMoreTwo.setDate(onDayMoreTwo.getDate() + 2);
            const reservationInDate = new Date();
            const stringDate = reservationExist.date.toString();
            const yearDate = stringDate.substring(0, 4);
            const monthDate = stringDate.substring(4, 6);
            const dayString = stringDate.substring(6, 8);
            const monthDateInt = parseInt(monthDate);
            reservationInDate.setFullYear(parseInt(yearDate));
            reservationInDate.setMonth(monthDateInt - 1);
            reservationInDate.setDate(parseInt(dayString));
            if (onDayMoreTwo >= reservationInDate && reservationExist.reservationStatus === true) {
                const createTaxed = yield prisma_1.default.taxed.create({
                    data: {
                        apartment_id: user.apartment.id,
                        dateGuest: reservationInDate,
                        email: user.email,
                        phone_number: user.phone_number,
                        name: `${user.name} ${user.lastname}`
                    }
                });
                const mensagem = `
      <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
          <p>Prezado Morador, ${createTaxed.name}</p>
  
          <p>ℹ️ Sua reserva cancelada foi sujeita a uma taxa de <strong>R$ 100,00</strong>.</p>
  
          <p>⚠️ Por favor, esteja ciente das políticas de cancelamento antes de fazer futuras reservas para evitar taxas adicionais.</p>
  
          <p>ℹ️ Se precisar de mais esclarecimentos, entre em contato conosco.</p>
  
          <p>Atenciosamente,<br>
          Equipe SalãoCondo 🌟</p>
      </div>
  `;
                (0, SendEmail_1.SendEmail)(user.email, mensagem);
            }
            const thereAwaitList = yield prisma_1.default.waitingList.findMany({
                where: {
                    date: reservationExist.date,
                    user: {
                        apartment: {
                            id: {
                                not: user.apartment.id,
                            },
                            tower_id: user.apartment.tower.id,
                        },
                    },
                },
                select: {
                    user: {
                        select: {
                            email: true
                        },
                    },
                },
            });
            if (thereAwaitList.length > 0) {
                for (var x = 0; x < thereAwaitList.length; x++) {
                    const awaitListMensagem = `
        <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
            <p>Prezado Morador,</p>
    
            <p>ℹ️ A reserva que você estava aguardando na lista de espera foi cancelada.</p>
    
            <p>📅 Essa vaga agora está disponível para agendamento. Não perca a oportunidade de reservá-la!</p>
    
            <p>🔗 Visite nosso sistema de reservas para garantir a data desejada.</p>
    
            <p>ℹ️ Se precisar de assistência ou tiver alguma dúvida, entre em contato conosco.</p>
    
            <p>Atenciosamente,<br>
            Equipe SalãoCondo 🌟</p>
        </div>
    `;
                    (0, SendEmail_1.SendEmail)(thereAwaitList[x].user.email, awaitListMensagem);
                }
            }
            const deleteReservation = yield prisma_1.default.reservation.delete({
                where: {
                    id: reservation_id
                }
            });
            return { ok: true };
        });
    }
}
exports.DeleteReservationUserServices = DeleteReservationUserServices;
