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
exports.FilterTodayReservationsServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class FilterTodayReservationsServices {
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
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
            const getReservations = yield prisma_1.default.reservation.findMany({
                where: {
                    date: {
                        equals: dateInt
                    },
                    reservationStatus: true
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
                        }
                    }
                },
                orderBy: {
                    date: "desc"
                }
            });
            return getReservations;
        });
    }
}
exports.FilterTodayReservationsServices = FilterTodayReservationsServices;
