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
exports.FilterFutureReservationsServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class FilterFutureReservationsServices {
    execute({ per_page, page }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!per_page || !page) {
                throw new Error('Envie todos os dados');
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
            const getReservations = yield prisma_1.default.reservation.findMany({
                where: {
                    date: {
                        gt: dateInt
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
                }, orderBy: {
                    date: "desc"
                }
            });
            const per_page_number = parseInt(per_page);
            const pages_number = parseInt(page);
            const pagesMax = Math.ceil(getReservations.length / per_page_number);
            const sendPage = Math.max(1, Math.min(pages_number, pagesMax));
            const sliceStart = (sendPage - 1) * per_page_number;
            const sliceEnd = (sendPage * per_page_number);
            const sliceReservations = getReservations.slice(sliceStart, sliceEnd);
            return {
                itens: sliceReservations,
                maxPages: pagesMax
            };
        });
    }
}
exports.FilterFutureReservationsServices = FilterFutureReservationsServices;
