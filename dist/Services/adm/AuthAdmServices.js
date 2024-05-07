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
exports.AuthAdmServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const FormatEmail_1 = require("../../utils/FormatEmail");
class AuthAdmServices {
    execute({ email, pass }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email || !pass) {
                throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
            }
            const adm = yield prisma_1.default.adm.findFirst({
                where: {
                    email: (0, FormatEmail_1.FormatEmail)(email)
                }
            }); //procurando se tem um email no banco igual ao digitado
            if (!adm) {
                throw new Error("Erro de validação: Seus dados estão incorretos. Verifique as informações e tente novamente.");
            } // se não tiver retorna um erro
            const compareSenha = yield (0, bcryptjs_1.compare)(pass, adm.pass); // criptografia de senha
            if (!compareSenha) {
                throw new Error("Erro de validação: Seus dados estão incorretos. Verifique as informações e tente novamente.");
            } // se não tiver certo a senha
            const token = (0, jsonwebtoken_1.sign)({
                email: adm.email,
                nome: adm.name
            }, process.env.AJWT_SECRET, {
                subject: adm.id,
                expiresIn: "30d"
            }); // pegando dados para criar o token de autenticação 
            const hashToken = yield (0, bcryptjs_1.hash)(token, 8);
            const setToken = yield prisma_1.default.token.create({
                data: {
                    adm_id: adm.id,
                    id: hashToken,
                }
            });
            return ({
                email: adm.email,
                nome: adm.name,
                sobrenome: adm.lastname,
                id: adm.id,
                token: token,
                phone_number: adm.phone_number
            });
        });
    }
}
exports.AuthAdmServices = AuthAdmServices;
