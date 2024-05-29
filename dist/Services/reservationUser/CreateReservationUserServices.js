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
exports.CreateReservationUserServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const SendEmail_1 = require("../../utils/SendEmail");
class CreateReservationUserServices {
    execute({ date, cleaning, start, finish, user_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user_id || !date || cleaning === null || !start || !finish) {
                throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
            }
            const dateString = date.toString();
            if (dateString.length % 8) {
                throw new Error("date inválida");
            }
            const year = dateString.substring(0, 4);
            const month = dateString.substring(4, 6);
            const day = dateString.substring(6, 8);
            const yearInt = parseInt(year);
            const monthInt = parseInt(month);
            const dayInt = parseInt(day);
            const onDay = new Date();
            const actuallyYear = onDay.getFullYear();
            const reservationDate = new Date();
            reservationDate.setFullYear(yearInt);
            reservationDate.setMonth(monthInt - 1);
            reservationDate.setDate(dayInt);
            if (actuallyYear > yearInt) {
                throw new Error('Data inválida, ex: "ano/mês/dia');
            }
            if (monthInt < 1 || monthInt > 12) {
                throw new Error('Data inválida, ex: "ano/mês/dia');
            }
            if (dayInt < 1 || dayInt > 31) {
                throw new Error('Data inválida, ex: "ano/mês/dia');
            }
            if (onDay > reservationDate) {
                throw new Error('Data antiga!');
            }
            if (start.toString().length % 4 || finish.toString().length % 4) {
                throw new Error("Horário inválido");
            }
            const parseIntFinish = parseInt(finish);
            const parseIntStart = parseInt(start);
            if (parseIntFinish < parseIntStart) {
                throw new Error("Horário inválido");
            }
            const user = yield prisma_1.default.user.findFirst({
                where: {
                    id: user_id
                }, select: {
                    name: true,
                    lastname: true,
                    email: true,
                    phone_number: true,
                    apartment: {
                        select: {
                            tower_id: true,
                            id: true
                        }
                    }
                }
            });
            if (!user) {
                throw new Error('Usuário inválido!');
            }
            const pagamentoactive = yield prisma_1.default.apartment.findFirst({
                where: {
                    id: user.apartment.id,
                    payment: true
                }
            });
            if (!pagamentoactive) {
                throw new Error("O pagamento do seu condomínio está pendente. Se já efetuou o pagamento, por favor, entre em contato com a administração.");
            }
            const agendamentoExist = yield prisma_1.default.reservation.findFirst({
                where: {
                    date: date,
                    apartment: {
                        tower_id: user.apartment.tower_id
                    },
                    reservationStatus: true,
                }
            });
            if (agendamentoExist) {
                throw new Error("Uma reserva já foi confirmada nessa data");
            }
            const itsMy = yield prisma_1.default.reservation.findFirst({
                where: {
                    apartment_id: user.apartment.id,
                    date: date
                }
            });
            if (itsMy) {
                throw new Error("Você já soliciitou uma reserva pra esse dia");
            }
            if (start >= finish) {
                throw new Error('O horário de início da reserva não pode ser posterior ou igual ao término.');
            }
            const createReservation = yield prisma_1.default.reservation.create({
                data: {
                    cleaningService: cleaning,
                    apartment_id: user.apartment.id,
                    date: date,
                    start: parseIntStart,
                    finish: parseIntFinish,
                    email: user.email,
                    phone_number: user.phone_number,
                    name: `${user.name} ${user.lastname}`
                }, select: {
                    id: true,
                    apartment: true,
                    cleaningService: true,
                    date: true,
                    start: true,
                    finish: true
                }
            });
            const admEmail = yield prisma_1.default.adm.findMany({
                select: {
                    email: true
                }
            });
            function formatDate(date) {
                const string = date.toString();
                const year = string.substring(0, 4);
                const month = string.substring(4, 6);
                const day = string.substring(6, 8);
                return `${day}/${month}/${year}`;
            }
            function formatHours(number) {
                const numberInString = number.toString();
                if (numberInString.length === 4) {
                    const string = number.toString();
                    const hours = string.substring(0, 2);
                    const minutes = string.substring(2, 4);
                    return `${hours}:${minutes}`;
                }
                else {
                    const string = number.toString();
                    const hours = string.substring(0, 1);
                    const minutes = string.substring(1, 3);
                    return `${hours}:${minutes}`;
                }
            }
            const message = `
        <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
            <p>Olá, administrador do SalãoCondo,</p>
    
            <p>ℹ️ Uma nova reserva foi solicitada para o dia ${formatDate(createReservation.date)}, das ${formatHours(createReservation.start)} às ${formatHours(createReservation.finish)}.</p>
    
            <p>⏳ Não deixe o morador esperando. Aprove ou reprove a reserva o mais rápido possível!</p>
    
            <p>Atenciosamente,<br>
            Equipe SalãoCondo 🌟</p>
        </div>
    `;
            for (var x = 0; x < admEmail.length; x++) {
                const getEmail = admEmail[x].email;
                (0, SendEmail_1.SendEmail)(getEmail, message);
            }
            return (createReservation);
        });
    }
}
exports.CreateReservationUserServices = CreateReservationUserServices;
