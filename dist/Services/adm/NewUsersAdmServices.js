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
exports.NewUsersAdmServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class NewUsersAdmServices {
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield prisma_1.default.user.findMany({
                where: {
                    accountStatus: null,
                },
                select: {
                    cpf: true,
                    id: true,
                    name: true,
                    lastname: true,
                    email: true,
                    photo: true,
                    accountStatus: true,
                    phone_number: true,
                    apartment_id: true,
                    apartment: {
                        select: {
                            numberApt: true,
                            tower_id: true,
                            payment: true,
                            payday: true,
                            tower: {
                                select: {
                                    numberTower: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    name: 'asc', // Certifique-se de que 'name' está presente na tabela ou escolha um campo válido
                },
            });
            return users;
        });
    }
}
exports.NewUsersAdmServices = NewUsersAdmServices;
