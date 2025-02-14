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
exports.GuestAddServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class GuestAddServices {
    execute(createGuest) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!createGuest) {
                throw new Error('Envie todos os dados');
            }
            for (const item of createGuest.Guest) {
                try {
                    if (item.rg.length !== 5) {
                        throw new Error('Digite apenas os 4 últimos dígitos do RG');
                    }
                    const pushGuest = yield prisma_1.default.guest.create({
                        data: {
                            name: item.name,
                            rg: item.rg,
                            reservation_id: createGuest.reservation_id
                        }
                    });
                }
                catch (error) {
                    console.error(error);
                }
            }
            return createGuest;
        });
    }
}
exports.GuestAddServices = GuestAddServices;
