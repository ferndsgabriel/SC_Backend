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
exports.DeleteAptAdmServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DeleteAptAdmServices {
    execute({ apartment_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!apartment_id) {
                throw new Error('ID do apartamento não inserido.');
            }
            const aptExist = yield prisma_1.default.apartment.findFirst({
                where: {
                    id: apartment_id
                }
            });
            if (!aptExist) {
                throw new Error('Apartamento inexistente.');
            }
            const userContains = yield prisma_1.default.user.findFirst({
                where: {
                    apartment_id: apartment_id
                }
            });
            if (userContains) {
                throw new Error('Impossível excluir. Apartamento possui moradores.');
            }
            const deleteApt = yield prisma_1.default.apartment.delete({
                where: {
                    id: apartment_id
                }
            });
            return ({ ok: true });
        });
    }
}
exports.DeleteAptAdmServices = DeleteAptAdmServices;
