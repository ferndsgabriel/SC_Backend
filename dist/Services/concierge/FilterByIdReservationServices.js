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
exports.FilterByIdReservationServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class FilterByIdReservationServices {
    execute(reservation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!reservation_id) {
                throw new Error("Insira o ID da reserva");
            }
            const addZero = (value) => {
                if (value < 10) {
                    return `0${value}`;
                }
                else {
                    return `${value}`;
                }
            };
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const data = `${addZero(year)}${addZero(month)}${addZero(day)}`;
            const dateInt = parseInt(data);
            const reservation = yield prisma_1.default.reservation.findFirst({
                where: {
                    id: reservation_id
                }, select: {
                    id: true,
                    apartment: {
                        select: {
                            numberApt: true,
                            tower: {
                                select: {
                                    numberTower: true
                                }
                            }
                        }
                    }, cleaningService: true,
                    date: true,
                    start: true,
                    finish: true,
                    name: true,
                    phone_number: true,
                    GuestList: {
                        select: {
                            attended: true,
                            id: true,
                            name: true,
                            rg: true
                        }, orderBy: {
                            name: 'asc'
                        }
                    }
                }
            });
            return { reservation, isEditable: dateInt === reservation.date ? true : false };
        });
    }
}
exports.FilterByIdReservationServices = FilterByIdReservationServices;
