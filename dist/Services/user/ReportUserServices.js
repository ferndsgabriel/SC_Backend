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
exports.ReportUserServices = void 0;
const SendEmail_1 = require("../../utils/SendEmail");
const prisma_1 = __importDefault(require("../../prisma"));
class ReportUserServices {
    execute({ id, message, option }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || !message || option < 1 || option > 2) {
                throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
            }
            const userExist = yield prisma_1.default.user.findFirst({
                where: {
                    id: id
                },
                select: {
                    phone_number: true,
                    name: true,
                    lastname: true,
                    email: true,
                    apartment: {
                        select: {
                            numberApt: true,
                            tower: {
                                select: {
                                    numberTower: true
                                }
                            }
                        }
                    }
                }
            });
            if (!userExist) {
                throw new Error('Usuário não existe.');
            }
            let sendMessage = '';
            if (option === 1) {
                sendMessage = `
            <h2>🚨 Novo Bug ou Problema Reportado!</h2>
            <p><strong>Detalhes do Morador:</strong></p>
            <ul>
                <li><strong>Nome:</strong> ${userExist.name} ${userExist.lastname}</li>
                <li><strong>Torre:</strong> ${userExist.apartment.tower.numberTower}</li>
                <li><strong>Apartamento:</strong> ${userExist.apartment.numberApt}</li>
                <li><strong>E-mail:</strong> ${userExist.email}</li>
            </ul>
            <p><strong>Mensagem do Morador:</strong></p>
            <blockquote style="font-style: italic; color: #555;">
                "${message}"
            </blockquote>
            <p>Por favor, verifique e resolva o mais rápido possível. Obrigado!</p>`;
            }
            else if (option === 2) {
                sendMessage = `
            <h2>📬 Novo Feedback Recebido!</h2>
            <p><strong>Detalhes do Morador:</strong></p>
            <ul>
                <li><strong>Nome:</strong> ${userExist.name} ${userExist.lastname}</li>
                <li><strong>Torre:</strong> ${userExist.apartment.tower.numberTower}</li>
                <li><strong>Apartamento:</strong> ${userExist.apartment.numberApt}</li>
                <li><strong>E-mail:</strong> ${userExist.email}</li>
            </ul>
            <p><strong>Mensagem do Morador:</strong></p>
            <blockquote style="font-style: italic; color: #555;">
                "${message}"
            </blockquote>`;
            }
            const admEmail = yield prisma_1.default.adm.findMany({
                select: {
                    email: true
                }
            });
            for (var x = 0; x < admEmail.length; x++) {
                const getEmail = admEmail[x].email;
                (0, SendEmail_1.SendEmail)(getEmail, sendMessage);
            }
            return { ok: true };
        });
    }
}
exports.ReportUserServices = ReportUserServices;
