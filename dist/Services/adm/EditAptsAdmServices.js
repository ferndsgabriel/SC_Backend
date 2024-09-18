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
exports.EditAptsAdmServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class EditAptsAdmServices {
    execute({ apartment_id, newApt }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!apartment_id || !newApt) {
                throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
            }
            const exisApt = yield prisma_1.default.apartment.findFirst({
                where: {
                    id: apartment_id,
                }
            });
            if (!exisApt) {
                throw new Error('Apartamento inexistente.');
            }
            const isUnique = yield prisma_1.default.apartment.findFirst({
                where: {
                    numberApt: newApt,
                    tower_id: exisApt.tower_id
                }
            });
            if (exisApt.numberApt === newApt) {
                throw new Error('Apartamento novo igual ao atual.');
            }
            if (isUnique) {
                throw new Error('Número de apartamento já existente.');
            }
            const editApt = yield prisma_1.default.apartment.update({
                where: {
                    id: apartment_id,
                }, data: {
                    numberApt: newApt,
                }
            });
            return (editApt);
        });
    }
}
exports.EditAptsAdmServices = EditAptsAdmServices;
