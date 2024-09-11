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
exports.CreateAdmServices = void 0;
const bcryptjs_1 = require("bcryptjs");
const prisma_1 = __importDefault(require("../../prisma"));
const FormatPhone_1 = require("../../utils/FormatPhone");
const FormatEmail_1 = require("../../utils/FormatEmail");
const Capitalize_1 = require("../../utils/Capitalize");
const crypto_1 = require("crypto");
class CreateAdmServices {
    execute({ email, pass, cod, name, lastname, phone_number }) {
        return __awaiter(this, void 0, void 0, function* () {
            function onlyString(string) {
                if (!/^[a-zA-Z]+$/.test(string)) {
                    return false;
                }
                return true;
            }
            if (!email || !pass || !cod || !name || !lastname || !phone_number) {
                throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
            }
            if (name.length < 3 || lastname.length < 4) {
                throw new Error('Nome inválido.');
            }
            if (!onlyString(name) || !onlyString(lastname)) {
                throw new Error('Nome inválido.');
            }
            const EmailExist = yield prisma_1.default.adm.findFirst({
                where: {
                    email: (0, FormatEmail_1.FormatEmail)(email)
                }
            });
            if (EmailExist) {
                throw new Error("Email já existente.");
            }
            const numberExist = yield prisma_1.default.user.findFirst({
                where: {
                    phone_number: (0, FormatPhone_1.FormatPhone)(phone_number)
                }
            });
            if (numberExist) {
                throw new Error('Telefone já vinculado a outra conta.');
            }
            const compareSenhaADM = yield (0, bcryptjs_1.compare)(cod, process.env.ADM_PASS);
            if (!compareSenhaADM) {
                throw new Error('Código de administrador incorreto.');
            }
            const admHash = yield (0, bcryptjs_1.hash)(pass, 8);
            const uuid = (0, crypto_1.randomUUID)();
            const adm = yield prisma_1.default.adm.create({
                data: {
                    email: (0, FormatEmail_1.FormatEmail)(email),
                    pass: admHash,
                    name: (0, Capitalize_1.Capitalize)(name),
                    lastname: (0, Capitalize_1.Capitalize)(lastname),
                    phone_number: (0, FormatPhone_1.FormatPhone)(phone_number),
                    sessionToken: uuid,
                }, select: {
                    email: true,
                    id: true,
                    name: true,
                    lastname: true,
                    phone_number: true
                }
            });
            return ({
                adm
            });
        });
    }
}
exports.CreateAdmServices = CreateAdmServices;
