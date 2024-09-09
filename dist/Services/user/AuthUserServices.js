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
exports.AuthUserServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const jsonwebtoken_1 = require("jsonwebtoken");
const bcryptjs_1 = require("bcryptjs");
const FormatEmail_1 = require("../../utils/FormatEmail");
class AuthUserServices {
    execute({ email, pass }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email || !pass) {
                throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
            }
            const user = yield prisma_1.default.user.findFirst({
                where: {
                    email: (0, FormatEmail_1.FormatEmail)(email),
                }, select: {
                    id: true,
                    name: true,
                    lastname: true,
                    email: true,
                    photo: true,
                    phone_number: true,
                    apartment_id: true,
                    pass: true,
                    accountStatus: true,
                    apartment: {
                        select: {
                            numberApt: true,
                            tower_id: true,
                            payment: true,
                            tower: {
                                select: {
                                    numberTower: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!user) {
                throw new Error('Erro de validação: Seus dados estão incorretos. Verifique as informações e tente novamente.');
            }
            const compareSenha = yield (0, bcryptjs_1.compare)(pass, user.pass);
            if (!compareSenha) {
                throw new Error('Erro de validação: Seus dados estão incorretos. Verifique as informações e tente novamente.');
            }
            if (user.accountStatus === null) {
                throw new Error('Status de análise: Seu perfil está atualmente em processo de análise. Aguarde a conclusão.');
            }
            if (user.accountStatus === false) {
                throw new Error('Recusa de acesso: Seu pedido foi recusado devido a informações inadequadas.');
            }
            const token = (0, jsonwebtoken_1.sign)({
                email: user.email,
                name: user.name,
            }, process.env.UJWT_SECRET, {
                subject: user.id,
                expiresIn: '30d',
            });
            const hashToken = yield (0, bcryptjs_1.hash)(token, 8);
            const setToken = yield prisma_1.default.token.create({
                data: {
                    user_id: user.id,
                    id: hashToken,
                },
            });
            const userData = {
                id: user.id,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                photo: user.photo,
                phone_number: user.phone_number,
                apartment_id: user.apartment_id,
                apartment: user.apartment
            };
            return {
                userData: userData,
                token: token,
            };
        });
    }
}
exports.AuthUserServices = AuthUserServices;
