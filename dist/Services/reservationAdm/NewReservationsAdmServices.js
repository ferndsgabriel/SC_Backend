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
exports.NewReservationsAdmServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class NewReservationsAdmServices {
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const onDay = new Date();
            const year = onDay.getFullYear();
            const month = onDay.getMonth() + 1;
            const day = onDay.getDate();
            function setZero(number) {
                if (number < 10) {
                    return `0${number}`;
                }
                else {
                    return number;
                }
            }
            const monthWithZero = setZero(month);
            const dayWithZero = setZero(day);
            const onDayValue = parseInt(`${year}${monthWithZero}${dayWithZero}`);
            const readingAgends = yield prisma_1.default.reservation.findMany({
                where: {
                    reservationStatus: null,
                    date: {
                        gte: onDayValue
                    },
                },
                select: {
                    id: true,
                    date: true,
                    start: true,
                    finish: true,
                    cleaningService: true,
                    name: true,
                    email: true,
                    phone_number: true,
                    guest: true,
                    apartment: {
                        select: {
                            id: true,
                            numberApt: true,
                            payment: true,
                            user: {
                                select: {
                                    name: true,
                                    lastname: true,
                                    email: true,
                                    phone_number: true
                                }
                            },
                            tower: {
                                select: {
                                    id: true,
                                    numberTower: true
                                }
                            }
                        }
                    }
                }, orderBy: {
                    date: 'asc'
                }
            });
            return readingAgends;
        });
    }
}
exports.NewReservationsAdmServices = NewReservationsAdmServices;
