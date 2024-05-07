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
exports.CodRecoveyAdmServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const SendEmail_1 = require("../../utils/SendEmail");
const FormatEmail_1 = require("../../utils/FormatEmail");
const bcryptjs_1 = require("bcryptjs");
class CodRecoveyAdmServices {
    execute({ email }) {
        return __awaiter(this, void 0, void 0, function* () {
            function getRandomCode() {
                const codigo = Math.floor(Math.random() * 900000) + 100000;
                return codigo.toString();
            }
            const randomCode = getRandomCode();
            if (!email) {
                throw new Error('E-mail não inserido.');
            }
            const adm = yield prisma_1.default.adm.findFirst({
                where: {
                    email: (0, FormatEmail_1.FormatEmail)(email)
                }, select: {
                    id: true,
                    countCod: true,
                    name: true,
                    lastname: true,
                    codDate: true,
                    email: true
                }
            });
            if (!adm) {
                throw new Error('Usuário não encontrado para este e-mail.');
            }
            const data = new Date();
            const onDayMore1 = adm.codDate;
            onDayMore1.setDate(onDayMore1.getDate() + 1);
            if (adm.countCod >= 5 && onDayMore1 > data) {
                throw new Error('Você ultrapassou o limite diário de códigos de recuperação: 5. Aguarde 24 horas.');
            }
            const codHash = yield (0, bcryptjs_1.hash)(randomCode, 8);
            if (onDayMore1 < data) {
                const setToken = yield prisma_1.default.adm.update({
                    where: {
                        id: adm.id
                    }, data: {
                        codRecovery: codHash,
                        codDate: data,
                        countCod: 0
                    }
                });
            }
            else {
                const setToken = yield prisma_1.default.adm.update({
                    where: {
                        id: adm.id
                    }, data: {
                        codRecovery: codHash,
                        codDate: data,
                        countCod: adm.countCod + 1
                    }
                });
            }
            const mensagem = `
    Olá, ${adm.name} ${adm.lastname}<br><br>
  
    Recebemos uma solicitação de recuperação de conta para o SalãoCondo.<br>
    Utilize o seguinte código para concluir o processo de recuperação:<br><br>
  
    <strong>${randomCode}</strong><br><br>
  
    Este código é válido por um curto período de tempo. Não compartilhe com ninguém.<br><br>
  
    Se você não solicitou essa recuperação ou tiver qualquer dúvida, entre em contato conosco.<br><br>
  
    Atenciosamente,<br>
    Equipe de Suporte do SalãoCondo
  `;
            (0, SendEmail_1.SendEmail)(adm.email, mensagem);
            return ({ ok: true });
        });
    }
}
exports.CodRecoveyAdmServices = CodRecoveyAdmServices;
