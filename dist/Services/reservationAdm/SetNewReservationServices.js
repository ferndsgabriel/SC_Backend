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
            const reservation = yield prisma_1.default.reservation.findFirst({
                where: {
                    id: reservation_id
                },
                select: {
                    id: true,
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
            if (!reservation) {
                throw new Error('Reserva não encontrada.');
            }
            if (status !== false) {
                const existOther = yield prisma_1.default.reservation.findFirst({
                    where: {
                        reservationStatus: true,
                        date: reservation.date,
                        apartment: {
                            tower_id: reservation.apartment.tower_id
                        },
                        finish: {
                            gte: reservation.start
                        }
                    }
                });
                if (existOther) {
                    throw new Error('Você já aprovou uma reserva nessa data.');
                }
            }
            const onDay = new Date();
            const updatedReservation = yield prisma_1.default.reservation.update({
                where: {
                    id: reservation_id
                },
                data: {
                    reservationStatus: status,
                    approvalDate: onDay
                }
            });
            let message = '';
            let eventLink = '';
            function hourGoogleCalendar(hourNumber) {
                const hour = hourNumber.toString().padStart(4, '0');
                const gotHour = hour.substring(0, 2);
                const gotMinutes = hour.substring(2, 4);
                return `${gotHour}:${gotMinutes}:00`;
            }
            function dateGoogleCalendar(date) {
                const dateString = date.toString();
                const year = dateString.substring(0, 4);
                const month = dateString.substring(4, 6);
                const day = dateString.substring(6, 8);
                return `${year}-${month}-${day}`;
            }
            function getLinkGoogleCalendar() {
                return __awaiter(this, void 0, void 0, function* () {
                    const eventInit = new Date(`${dateGoogleCalendar(reservation.date)}T${hourGoogleCalendar(reservation.start)}`);
                    const eventFinish = new Date(`${dateGoogleCalendar(reservation.date)}T${hourGoogleCalendar(reservation.finish)}`);
                    const title = 'Reserva confirmada - SalãoCondo';
                    const description = '';
                    const local = '';
                    const dateInitFormat = eventInit.toISOString().replace(/-|:|\.\d+/g, "");
                    const dateFinishFormat = eventFinish.toISOString().replace(/-|:|\.\d+/g, "");
                    const url = 'https://calendar.google.com/calendar/render?action=TEMPLATE&dates';
                    eventLink = `${url}=${dateInitFormat}/${dateFinishFormat}&text=${encodeURIComponent(title)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(local)}`;
                });
            }
            yield getLinkGoogleCalendar();
            if (status) {
                message = `
            <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
                <h2 style="color: #0066ff;">🎉 SalãoCondo, sobre sua reserva do salão 🎉</h2>
                <p>Oba! Com grande alegria, informamos que sua reserva foi aceita com sucesso!</p>
                <p>Agora você pode preencher a lista de convidados para o evento. Temos certeza de que será uma ocasião especial e estamos ansiosos para recebê-lo juntamente com seus convidados.</p>
                <p>Você pode salvar sua reserva no Google Calendário através <a href="${eventLink}" style="color: #0066ff;">deste link</a>.</p>
            </div>
        `;
            }
            else {
                message = `
            <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
                <p>Prezado Morador,</p>
                <p>Lamentamos informar que não podemos aceitar a sua reserva do salão neste momento. Pedimos desculpas pela inconveniência que isso possa causar.</p><br>
                
                <p>Atenciosamente,<br>
                Equipe SalãoCondo 🌟</p>
            </div>
        `;
            }
            const usersInApartment = yield prisma_1.default.user.findMany({
                where: {
                    apartment_id: reservation.apartment.id
                },
                select: {
                    email: true,
                }
            });
            for (const user of usersInApartment) {
                (0, SendEmail_1.SendEmail)(user.email, message);
            }
            const deleteAllFalse = yield prisma_1.default.reservation.deleteMany({
                where: {
                    reservationStatus: false
                }
            });
            return updatedReservation;
        });
    }
}
exports.SetNewReservationServices = SetNewReservationServices;
