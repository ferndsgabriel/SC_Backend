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
exports.DetailUserServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DetailUserServices {
    execute(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user_id) {
                throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
            }
            const details = yield prisma_1.default.user.findFirst({
                where: {
                    id: user_id
                }, select: {
                    id: true,
                    name: true,
                    lastname: true,
                    email: true,
                    photo: true,
                    phone_number: true,
                    apartment_id: true,
                    sessionToken: true,
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
            return (details);
        });
    }
}
exports.DetailUserServices = DetailUserServices;
