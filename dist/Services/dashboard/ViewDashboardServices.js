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
exports.ViewDashboardServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const DateInInt_1 = __importDefault(require("../../utils/DateInInt"));
class ViewDashboardServices {
    execute({ period }) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        return __awaiter(this, void 0, void 0, function* () {
            // Consulta para moradores
            const allUsersInSystem = yield prisma_1.default.user.findMany({
                where: {
                    createDate: {
                        lte: period
                    }
                }
            });
            const totalUsers = (_a = allUsersInSystem.length) !== null && _a !== void 0 ? _a : 0;
            // Consulta para administradores
            const allAdminsInSystem = yield prisma_1.default.adm.findMany({
                where: {
                    createDate: {
                        lte: period
                    }
                }
            });
            const totalAdmins = (_b = allAdminsInSystem.length) !== null && _b !== void 0 ? _b : 0;
            // Consulta para torres
            const allTowersInSystem = yield prisma_1.default.tower.findMany();
            const totalTowers = (_c = allTowersInSystem.length) !== null && _c !== void 0 ? _c : 0;
            // Consulta para apartamentos (sem filtro de data)
            const allApartmentsInSystem = yield prisma_1.default.apartment.findMany({
                select: {
                    payment: true,
                    user: true
                }
            });
            const totalApartments = (_d = allApartmentsInSystem.length) !== null && _d !== void 0 ? _d : 0;
            // Consulta para reservas (aplicando filtro de data)
            const allReservationsInSystem = yield prisma_1.default.reservation.findMany({
                where: {
                    createDate: {
                        lte: period
                    }
                },
                select: {
                    start: true,
                    finish: true,
                    cleaningService: true,
                    createDate: true,
                    guest: true,
                    date: true,
                    reservationStatus: true
                }
            });
            const totalReservations = (_e = allReservationsInSystem.length) !== null && _e !== void 0 ? _e : 0;
            // Consulta para reservas canceladas (aplicando filtro de data)
            const allCanceledReservationsInSystem = yield prisma_1.default.isCanceled.findMany({
                where: {
                    createDate: {
                        lte: period
                    }
                }
            });
            const totalCanceledReservations = (_f = allCanceledReservationsInSystem.length) !== null && _f !== void 0 ? _f : 0;
            // Total de reservas feitas (soma de reservas normais e canceladas)
            const totalReservationsMade = (_g = (totalCanceledReservations + totalReservations)) !== null && _g !== void 0 ? _g : 0;
            // Reservas em análise (aplicando filtro de data)
            const reservationsUnderAnalysis = allReservationsInSystem.filter(item => item.reservationStatus === null);
            const totalReservationsUnderAnalysis = (_h = reservationsUnderAnalysis.length) !== null && _h !== void 0 ? _h : 0;
            // Reservas finalizadas e em progresso (aplicando filtro de data)
            const now = new Date();
            const reservationsFinished = allReservationsInSystem.filter(item => item.date < (0, DateInInt_1.default)(now, 0) && item.reservationStatus === true);
            const reservationsInProgress = allReservationsInSystem.filter(item => item.date > (0, DateInInt_1.default)(now, 0) && item.reservationStatus === true);
            const totalReservationsFinished = (_j = reservationsFinished.length) !== null && _j !== void 0 ? _j : 0;
            const totalReservationsInProgress = (_k = reservationsInProgress.length) !== null && _k !== void 0 ? _k : 0;
            // Total de hóspedes (aplicando filtro de data)
            const guestsList = [];
            let totalGuests = 0;
            allReservationsInSystem.forEach(item => {
                if (item.guest) {
                    guestsList.push(item.guest);
                }
            });
            guestsList.forEach(item => {
                const names = item.split(',').filter(name => name.trim() !== '');
                totalGuests += names.length;
            });
            const averageGuestsPerReservation = (totalGuests / guestsList.length || 0).toFixed(2);
            // Cancelamentos com taxa (aplicando filtro de data)
            const taxedReservations = allCanceledReservationsInSystem.filter(item => item.isTaxed === true);
            const totalTaxedReservations = (_l = taxedReservations.length) !== null && _l !== void 0 ? _l : 0;
            // Apartamentos ocupados (sem filtro de data)
            const apartmentsWithOccupancy = allApartmentsInSystem.filter(item => item.user.length > 0);
            const compliantApartments = apartmentsWithOccupancy.filter(item => item.payment);
            const defaulterApartments = apartmentsWithOccupancy.filter(item => !item.payment);
            const totalCompliantApartments = (_m = compliantApartments.length) !== null && _m !== void 0 ? _m : 0;
            const totalDefaulterApartments = (_o = defaulterApartments.length) !== null && _o !== void 0 ? _o : 0;
            // Arrecadação (aplicando filtro de data)
            const taxRate = 80;
            const totalCollectionTaxed = (_p = totalTaxedReservations * taxRate) !== null && _p !== void 0 ? _p : 0;
            const cleaningServiceRate = 80;
            const reservationsWithCleaningService = reservationsFinished.filter(item => item.cleaningService);
            const totalCollectionCleaningService = (_q = reservationsWithCleaningService.length * cleaningServiceRate) !== null && _q !== void 0 ? _q : 0;
            const reservationRate = 100;
            const totalCollectionReservations = (_r = totalReservationsFinished * reservationRate) !== null && _r !== void 0 ? _r : 0;
            // Avaliações (aplicando filtro de data)
            const allAvaliation = yield prisma_1.default.avaliations.findMany({
                where: {
                    createDate: {
                        lte: period
                    }
                }
            });
            const totalAvaliation = (_s = allAvaliation.length) !== null && _s !== void 0 ? _s : 0;
            let totalAvaliationEase = 0;
            let totalAvaliationTime = 0;
            let totalAvaliationSpace = 0;
            let totalAvaliationHygiene = 0;
            allAvaliation.forEach(item => {
                totalAvaliationEase += item.ease;
                totalAvaliationTime += item.time;
                totalAvaliationSpace += item.space;
                totalAvaliationHygiene += item.hygiene;
            });
            const averageAvaliationEase = (totalAvaliationEase / totalAvaliation || 0).toFixed(2);
            const averageAvaliationTime = (totalAvaliationTime / totalAvaliation || 0).toFixed(2);
            const averageAvaliationSpace = (totalAvaliationSpace / totalAvaliation || 0).toFixed(2);
            const averageAvaliationHygiene = (totalAvaliationHygiene / totalAvaliation || 0).toFixed(2);
            // Top 3 apartamentos com mais reservas (sem filtro de data)
            function getTop3ApartmentsWithMostReservations() {
                return __awaiter(this, void 0, void 0, function* () {
                    const topApartments = yield prisma_1.default.apartment.findMany({
                        select: {
                            id: true,
                            numberApt: true,
                            tower: {
                                select: {
                                    numberTower: true
                                }
                            },
                            _count: {
                                select: {
                                    Reservations: true
                                }
                            }
                        },
                        orderBy: {
                            Reservations: {
                                _count: 'desc'
                            }
                        },
                        take: 3
                    });
                    const totalReservations = topApartments.reduce((acc, apartment) => acc + apartment._count.Reservations, 0);
                    return topApartments.map(apartment => (Object.assign(Object.assign({}, apartment), { percentage: ((apartment._count.Reservations / totalReservations) * 100 || 0).toFixed(2) })));
                });
            }
            const topApartments = yield getTop3ApartmentsWithMostReservations();
            const rawData = topApartments.map(item => ({
                name: item._count.Reservations > 0 ? `Torre ${item.tower.numberTower} - Apartamento ${item.numberApt}` : '',
                reservas: item._count.Reservations
            }));
            const withMoreReservations = rawData.sort((a, b) => b.reservas - a.reservas);
            // Resultados finais
            return {
                TotalCollection: (_t = (totalCollectionCleaningService + totalCollectionTaxed + totalCollectionReservations).toFixed(2)) !== null && _t !== void 0 ? _t : '0.00',
                Users: totalUsers !== null && totalUsers !== void 0 ? totalUsers : 0,
                Adms: totalAdmins !== null && totalAdmins !== void 0 ? totalAdmins : 0,
                Apartaments: totalApartments !== null && totalApartments !== void 0 ? totalApartments : 0,
                Towers: totalTowers !== null && totalTowers !== void 0 ? totalTowers : 0,
                TotalCollectionDetails: [
                    { category: 'Reservas', value: totalCollectionReservations },
                    { category: 'Cancelamentos', value: totalCollectionTaxed },
                    { category: 'Limpezas', value: totalCollectionCleaningService }
                ],
                AllReservationMade: totalReservationsMade !== null && totalReservationsMade !== void 0 ? totalReservationsMade : 0,
                ReservationMadeDetails: [
                    { name: 'Finalizadas', value: totalReservationsFinished !== null && totalReservationsFinished !== void 0 ? totalReservationsFinished : 0 },
                    { name: 'Aprovadas', value: totalReservationsInProgress !== null && totalReservationsInProgress !== void 0 ? totalReservationsInProgress : 0 },
                    { name: 'Em Análise', value: totalReservationsUnderAnalysis !== null && totalReservationsUnderAnalysis !== void 0 ? totalReservationsUnderAnalysis : 0 },
                    { name: 'Canceladas', value: totalCanceledReservations !== null && totalCanceledReservations !== void 0 ? totalCanceledReservations : 0 }
                ],
                OccupancyRate: [
                    { name: 'Ocupado', value: (_u = parseFloat(averageGuestsPerReservation)) !== null && _u !== void 0 ? _u : 0, limite: 30 },
                    { name: 'Disponível', value: 30 - parseFloat(averageGuestsPerReservation) }
                ],
                Payers: [
                    { category: 'Moradores', Adimplentes: totalCompliantApartments !== null && totalCompliantApartments !== void 0 ? totalCompliantApartments : 0, Inadimplentes: totalDefaulterApartments !== null && totalDefaulterApartments !== void 0 ? totalDefaulterApartments : 0 }
                ],
                Avaliation: {
                    data: [
                        { name: 'Limpeza', media: averageAvaliationHygiene !== null && averageAvaliationHygiene !== void 0 ? averageAvaliationHygiene : '0.00' },
                        { name: 'Espaço', media: averageAvaliationSpace !== null && averageAvaliationSpace !== void 0 ? averageAvaliationSpace : '0.00' },
                        { name: 'Rapidez', media: averageAvaliationTime !== null && averageAvaliationTime !== void 0 ? averageAvaliationTime : '0.00' },
                        { name: 'Facilidade', media: averageAvaliationEase !== null && averageAvaliationEase !== void 0 ? averageAvaliationEase : '0.00' }
                    ],
                    qtd: totalAvaliation !== null && totalAvaliation !== void 0 ? totalAvaliation : 0
                },
                WithMoreReservation: withMoreReservations
            };
        });
    }
}
exports.ViewDashboardServices = ViewDashboardServices;
