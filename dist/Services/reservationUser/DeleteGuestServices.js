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
exports.DeleteGuestServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DeleteGuestServices {
    execute(deleteGuest) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!deleteGuest || !Array.isArray(deleteGuest.Guest) || deleteGuest.Guest.length === 0) {
                throw new Error('Envie todos os dados');
            }
            for (const item of deleteGuest.Guest) {
                try {
                    const existingGuest = yield prisma_1.default.guest.findUnique({
                        where: { id: item }
                    });
                    if (!existingGuest) {
                        continue;
                    }
                    yield prisma_1.default.guest.delete({
                        where: { id: item }
                    });
                }
                catch (error) {
                    if (error.code === 'P2025') {
                        console.warn('error');
                    }
                    else {
                        console.error(error);
                    }
                }
            }
            return { ok: true };
        });
    }
}
exports.DeleteGuestServices = DeleteGuestServices;
