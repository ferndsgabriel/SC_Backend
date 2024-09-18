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
exports.AutomationPaymentServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class AutomationPaymentServices {
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const onDay = new Date(); // pegando o dia atual
            onDay.setDate(onDay.getDate() - 30); // adicionando a ele menos 30 dias
            const apartmentsToUpdate = yield prisma_1.default.apartment.findMany({
                where: {
                    payment: true,
                    payday: {
                        lte: onDay,
                    },
                },
            }); // pegando todos os apartamentos com status igua a true
            for (let x = 0; x < apartmentsToUpdate.length; x++) {
                yield prisma_1.default.apartment.update({
                    where: {
                        id: apartmentsToUpdate[x].id,
                    },
                    data: {
                        payment: false,
                    },
                });
            }
            return ('Pagamentos atualizados automaticamente');
        });
    }
}
exports.AutomationPaymentServices = AutomationPaymentServices;
