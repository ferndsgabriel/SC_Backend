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
exports.CreateUserService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const SendEmail_1 = require("../../utils/SendEmail");
const bcryptjs_1 = require("bcryptjs");
const FormatPhone_1 = require("../../utils/FormatPhone");
const Capitalize_1 = require("../../utils/Capitalize");
const FormatEmail_1 = require("../../utils/FormatEmail");
class CreateUserService {
    execute({ email, name, apartament_id, cpf, pass, lastname, phone_number, }) {
        return __awaiter(this, void 0, void 0, function* () {
            function onlyString(string) {
                if (!/^[a-zA-Z]+$/.test(string)) {
                    return false;
                }
                return true;
            }
            if (!email || !name || !apartament_id || !cpf || !pass || !lastname || !phone_number) {
                throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
            }
            if (name.length < 3 || lastname.length < 4) {
                throw new Error('Nome inválido.');
            }
            if (!onlyString(name) || !onlyString(lastname)) {
                throw new Error('Nome inválido.');
            }
            const cpfExist = yield prisma_1.default.user.findFirst({
                where: {
                    cpf: cpf,
                },
            });
            if (cpfExist) {
                throw new Error("CPF já vinculado a outra conta.");
            }
            const emailExist = yield prisma_1.default.user.findFirst({
                where: {
                    email: (0, FormatEmail_1.FormatEmail)(email),
                },
            });
            if (emailExist) {
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
            const aptExist = yield prisma_1.default.apartment.findFirst({
                where: {
                    id: apartament_id,
                }
            });
            if (!aptExist) {
                throw new Error("Este apartamento não existe.");
            }
            const hashPass = yield (0, bcryptjs_1.hash)(pass, 8);
            const user = yield prisma_1.default.user.create({
                data: {
                    name: (0, Capitalize_1.Capitalize)(name),
                    lastname: (0, Capitalize_1.Capitalize)(lastname),
                    email: (0, FormatEmail_1.FormatEmail)(email),
                    cpf: cpf,
                    pass: hashPass,
                    apartment_id: apartament_id,
                    phone_number: (0, FormatPhone_1.FormatPhone)(phone_number),
                    accountStatus: null,
                },
                select: {
                    name: true,
                    lastname: true,
                    email: true,
                    cpf: true,
                    id: true,
                    accountStatus: true,
                    phone_number: true,
                    apartment: {
                        select: {
                            numberApt: true,
                            tower_id: true,
                            id: true,
                        }
                    }
                },
            });
            const admEmail = yield prisma_1.default.adm.findMany({
                select: {
                    email: true
                }
            });
            const message = 'SalãoCondo: um novo usuário se-cadastrou.';
            for (var x = 0; x < admEmail.length; x++) {
                const getEmail = admEmail[x].email;
                (0, SendEmail_1.SendEmail)(getEmail, message);
            }
            return user;
        });
    }
}
exports.CreateUserService = CreateUserService;
