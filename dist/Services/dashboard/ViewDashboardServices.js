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
        return __awaiter(this, void 0, void 0, function* () {
            const allUserInSystem = yield prisma_1.default.user.findMany({
                where: {
                    createDate: {
                        gte: period
                    }
                }
            });
            const allUser = allUserInSystem.length; // qtd moradores
            //----------------------------------------------------------
            const allAdmInSystem = yield prisma_1.default.adm.findMany({
                where: {
                    createDate: {
                        gte: period
                    }
                }
            });
            const allAdm = allAdmInSystem.length; // qtd adm
            //----------------------------------------------------------
            const allTowerInSystem = yield prisma_1.default.tower.findMany({
                where: {
                    createDate: {
                        gte: period
                    }
                }
            });
            const allTowers = allTowerInSystem.length; // qtd torre
            //----------------------------------------------------------
            const allAptInSystem = yield prisma_1.default.apartment.findMany({
                where: {
                    createDate: {
                        gte: period
                    }
                },
                select: {
                    payment: true,
                    user: true
                }
            });
            const allApts = allAptInSystem.length; // qtd apartamento
            //----------------------------------------------------------
            const allReservationInSystem = yield prisma_1.default.reservation.findMany({
                where: {
                    createDate: {
                        gte: period
                    }
                },
                select: {
                    start: true,
                    finish: true,
                    cleaningService: true,
                    approvalDate: true,
                    createDate: true,
                    guest: true,
                    date: true,
                    reservationStatus: true
                }
            });
            const allReservationInSystemlength = allReservationInSystem.length; // qtd de reservas = em analise e  aprovadas 
            //----------------------------------------------------------
            const allReservationCanceledInSystem = yield prisma_1.default.isCanceled.findMany({
                where: {
                    createDate: {
                        gte: period
                    }
                }
            });
            const allCanceled = allReservationCanceledInSystem.length; // qtd de reservas canceladas
            //----------------------------------------------------------
            const allReservationMadeInSystem = (allCanceled + allReservationInSystemlength); // todas todas 
            // pego todas que estão na tabelas de reservas, analise ou aprovadas e soma com as canceladas
            //----------------------------------------------------------
            const reservationUnderAnalysis = [];
            allReservationInSystem.forEach((item) => {
                if (item.reservationStatus === null) {
                    reservationUnderAnalysis.push(item);
                }
            });
            const reservationUnderAnalysisQtd = reservationUnderAnalysis.length; // qtd de reservas em analise apenas
            //----------------------------------------------------------
            const now = new Date();
            const ReservationFinishedInSystem = [];
            const ReservationInProgress = [];
            allReservationInSystem.forEach((item) => {
                if (item.date < (0, DateInInt_1.default)(now, 0) && item.reservationStatus === true) {
                    ReservationFinishedInSystem.push(item);
                }
                else if (item.date > (0, DateInInt_1.default)(now, 0) && item.reservationStatus === true) {
                    ReservationInProgress.push(item);
                }
            });
            const allReservationFinished = ReservationFinishedInSystem.length; // qtd de reservas finalizadas
            const allReservationProgress = ReservationInProgress.length; // qtd de reservas em progresso
            //----------------------------------------------------------
            const theresGuest = [];
            let totalGuests = 0;
            allReservationInSystem.forEach((item) => {
                if (item.guest) {
                    theresGuest.push(item.guest);
                }
            });
            theresGuest.forEach(item => {
                const names = item.split(',').filter(name => name.trim() !== '');
                totalGuests += names.length;
            });
            const averageGuestsPerReservation = totalGuests / theresGuest.length; //taxa de ocupação
            //----------------------------------------------------------
            const allTaxedInSystem = [];
            const allCanceledSystem = [];
            allReservationCanceledInSystem.forEach((item) => {
                if (item.isTaxed === true) {
                    allTaxedInSystem.push(item);
                }
                else {
                    allCanceledSystem.push(item);
                }
            });
            const allTaxed = allTaxedInSystem.length; // canceladas com taxa
            const allTCanceled = allCanceledSystem.length; // apenas cancelads
            //----------------------------------------------------------
            const AllAptOcupation = [];
            const apartmentCompliant = [];
            const apartmentDefaulter = [];
            allAptInSystem.forEach((item) => {
                if (item.user.length > 0) {
                    AllAptOcupation.push(item);
                }
            });
            AllAptOcupation.forEach((item) => {
                if (item.payment) {
                    apartmentCompliant.push(item);
                }
                else {
                    apartmentDefaulter.push(item);
                }
            });
            const allCompliant = apartmentCompliant.length;
            const allDefaulter = apartmentDefaulter.length;
            //------------------------------------------- total de adimplente e adimplentes
            const rateValueTaxed = 80; // Valor da taxa de reserva
            const totalCollectionTaxed = (allTaxed * rateValueTaxed);
            //------------------------------------------- total arrecadado com taxas
            const listReservationWithCleaningServices = [];
            const rateCleaningService = 80;
            ReservationFinishedInSystem.forEach((item) => {
                if (item.cleaningService) {
                    listReservationWithCleaningServices.push(item);
                }
            });
            const totalCollectionCleaningService = (listReservationWithCleaningServices.length * rateCleaningService);
            //------------------------------------------- total arrecadado com serviço de limpeza
            const rateValueReservation = 100;
            const totalCollectionReservartion = (allReservationFinished * rateValueReservation);
            //------------------------------------------- total arrecadado com reservas
            function calculateAverageApprovalTime(createDates, approvalDates) {
                function toMinutes(timestamp) {
                    const date = new Date(timestamp);
                    return date.getTime() / 60000;
                }
                let totalApprovalTime = 0;
                for (let i = 0; i < createDates.length; i++) {
                    const createTime = toMinutes(createDates[i]);
                    const approvalTime = toMinutes(approvalDates[i]);
                    totalApprovalTime += (approvalTime - createTime);
                }
                const averageApprovalTime = totalApprovalTime / createDates.length;
                return averageApprovalTime;
            }
            const listAllRequestDate = [];
            const listAllApprovalDate = [];
            allReservationInSystem.forEach((item) => {
                if (item.approvalDate !== null && item.createDate !== null) {
                    listAllApprovalDate.push(item.approvalDate);
                    listAllRequestDate.push(item.createDate);
                }
            });
            const timeApproveReservationMinutes = calculateAverageApprovalTime(listAllRequestDate, listAllApprovalDate);
            //------------------------------------------- tempo para uma reserva ser aprovada
            const withAvaliation = yield prisma_1.default.avaliations.findMany({
                where: {
                    createDate: {
                        gt: period
                    }
                }
            });
            const qtdAvaliation = withAvaliation.length;
            let totalAvaliation = 0;
            withAvaliation.forEach((item) => {
                totalAvaliation += item.value;
            });
            const averageAvaliation = (totalAvaliation / qtdAvaliation);
            // ------------------------------------------------- avaliation
            function getTop3ApartmentsWithMostReservations() {
                return __awaiter(this, void 0, void 0, function* () {
                    const topApartments = yield prisma_1.default.apartment.findMany({
                        where: {
                            Reservations: {
                                every: {
                                    createDate: {
                                        gt: period
                                    }
                                }
                            }
                        },
                        select: {
                            id: true,
                            numberApt: true,
                            tower: {
                                select: {
                                    numberTower: true,
                                },
                            },
                            _count: {
                                select: {
                                    Reservations: true,
                                },
                            },
                        },
                        orderBy: {
                            Reservations: {
                                _count: 'desc',
                            },
                        },
                        take: 3,
                    });
                    const totalReservations = topApartments.reduce((acc, apartment) => acc + apartment._count.Reservations, 0);
                    const apartmentsWithPercentage = topApartments.map(apartment => {
                        const percentage = (apartment._count.Reservations / totalReservations) * 100;
                        return Object.assign(Object.assign({}, apartment), { percentage: percentage.toFixed(0) });
                    });
                    return apartmentsWithPercentage;
                });
            }
            const topApartments = yield getTop3ApartmentsWithMostReservations();
            // ------------------------------------------------- users more reservation
            const totalCollection = (totalCollectionCleaningService + totalCollectionTaxed + totalCollectionReservartion);
            const collection = [
                {
                    qtd: allTaxed,
                    name: 'Taxa',
                    money: totalCollectionTaxed,
                    percentage: ((totalCollectionTaxed / totalCollection) * 100).toFixed(1),
                },
                {
                    qtd: listReservationWithCleaningServices.length,
                    name: 'Limpeza',
                    money: totalCollectionCleaningService,
                    percentage: ((totalCollectionCleaningService / totalCollection) * 100).toFixed(1),
                },
                {
                    qtd: allReservationFinished,
                    name: 'Reserva',
                    money: totalCollectionReservartion,
                    percentage: ((totalCollectionReservartion / totalCollection) * 100).toFixed(1),
                }
            ];
            const avaliation = {
                qtd: qtdAvaliation,
                average: averageAvaliation
            };
            const reservationTotal = (allTaxed + reservationUnderAnalysisQtd + allReservationFinished + allTCanceled + allReservationProgress);
            const reservations = [
                {
                    qtd: allTaxed,
                    percentage: ((allTaxed / reservationTotal) * 100).toFixed(1),
                    name: 'Taxas'
                },
                {
                    qtd: reservationUnderAnalysisQtd,
                    percentage: ((reservationUnderAnalysisQtd / reservationTotal) * 100).toFixed(1),
                    name: 'Em analise'
                },
                {
                    qtd: allReservationProgress,
                    percentage: ((allReservationProgress / reservationTotal) * 100).toFixed(1),
                    name: 'Confirmadas'
                },
                {
                    qtd: allTCanceled,
                    percentage: ((allTCanceled / reservationTotal) * 100).toFixed(1),
                    name: 'Canceladas'
                },
                {
                    qtd: allReservationFinished,
                    percentage: ((allReservationFinished / reservationTotal) * 100).toFixed(1),
                    name: 'Finalizadas'
                }
            ];
            reservations.sort((a, b) => a.qtd - b.qtd);
            //------------------------------------------//
            const totalCollectionDetails = [
                { category: totalCollection, Taxadas: totalCollectionTaxed, Confirmadas: totalCollectionReservartion, Limpeza: totalCollectionCleaningService }
            ]; // detalhes de valores arrecadados para grafico 1
            const reservationMadeDetails = [
                { name: 'Concluídas', value: allReservationFinished },
                { name: 'Em Andamento', value: ReservationInProgress },
                { name: 'Em Análise', value: reservationUnderAnalysisQtd },
                { name: 'Canceladas', value: allCanceled }
            ]; // detalhes sobre os numeros de cada reservas
            const limit = 30;
            const occupancyRate = [
                { name: 'Ocupado', value: averageGuestsPerReservation ? averageGuestsPerReservation : 0, limite: limit },
                { name: 'Disponível', value: averageGuestsPerReservation ? limit - averageGuestsPerReservation : 0 }
            ]; // taxa de ocupação 
            const payers = [
                { category: 'Moradores', Adimplentes: allCompliant, Inadimplentes: allDefaulter },
            ]; // adimplentes x inadimplentes
            return ({
                TotalCollection: totalCollection,
                Users: allUser,
                Adms: allAdm,
                Apartaments: allApts,
                Towers: allTowers,
                TotalCollectionDetails: totalCollectionDetails,
                AllReservationMade: allReservationMadeInSystem,
                ReservationMadeDetails: reservationMadeDetails,
                OccupancyRate: occupancyRate,
                Payers: payers,
                Collection: collection,
                Avaliation: avaliation,
                UsersRating: true,
                Reservations: reservations,
                TotalReservation: reservationTotal,
                TopApartments: topApartments,
                TotalCollectionTaxed: totalCollectionTaxed,
            });
        });
    }
}
exports.ViewDashboardServices = ViewDashboardServices;
