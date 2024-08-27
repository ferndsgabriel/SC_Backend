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
            allReservationCanceledInSystem.forEach((item) => {
                if (item.isTaxed === true) {
                    allTaxedInSystem.push(item);
                }
            });
            const allTaxed = allTaxedInSystem.length; // canceladas com taxa
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
            const allCompliant = apartmentCompliant.length; // adimplentes 
            const allDefaulter = apartmentDefaulter.length; //inadimplentes
            //----------------------------------------------------------
            const rateValueTaxed = 80; // Valor da taxa de reserva
            const totalCollectionTaxed = (allTaxed * rateValueTaxed); // arrecadado com taxas
            //----------------------------------------------------------
            const listReservationWithCleaningServices = [];
            const rateCleaningService = 80;
            ReservationFinishedInSystem.forEach((item) => {
                if (item.cleaningService) {
                    listReservationWithCleaningServices.push(item);
                }
            });
            const totalCollectionCleaningService = (listReservationWithCleaningServices.length * rateCleaningService); // arrecadado com limpeza
            //----------------------------------------------------------
            const rateValueReservation = 100;
            const totalCollectionReservartion = (allReservationFinished * rateValueReservation); // arrecadado com reservas
            //----------------------------------------------------------
            const withAvaliation = yield prisma_1.default.avaliations.findMany({
                where: {
                    createDate: {
                        gte: period
                    }
                },
            });
            const qtdAvaliation = withAvaliation.length;
            let totalAvaliationEase = 0;
            let totalAvaliationTime = 0;
            let totalAvaliationSpace = 0;
            let totalAvaliationHygiene = 0;
            withAvaliation.forEach((item) => {
                totalAvaliationEase += item.ease;
                totalAvaliationTime += item.time;
                totalAvaliationSpace += item.space;
                totalAvaliationHygiene += item.hygiene;
            });
            const avaliationEase = (totalAvaliationEase / qtdAvaliation);
            const avaliationTime = (totalAvaliationTime / qtdAvaliation);
            const avaliationSpace = (totalAvaliationSpace / qtdAvaliation);
            const avaliationHygiene = (totalAvaliationHygiene / qtdAvaliation);
            // ------------------------------------------------- avaliation
            function getTop3ApartmentsWithMostReservations() {
                return __awaiter(this, void 0, void 0, function* () {
                    const topApartments = yield prisma_1.default.apartment.findMany({
                        where: {
                            Reservations: {
                                every: {
                                    createDate: {
                                        gte: period
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
            const rawData = topApartments
                ? topApartments.map(item => ({
                    name: item._count.Reservations > 0 ? `Torre ${item.tower.numberTower} - Apartamento ${item.numberApt}` : '',
                    reservas: item._count.Reservations
                }))
                : [];
            const withMoreReservation = rawData.sort((a, b) => b.reservas - a.reservas); // moradores com mais reservas
            // ----------------------------------------------------------------------------
            const avaliation = {
                data: [
                    { name: 'Limpeza', media: avaliationHygiene },
                    { name: 'Espaço', media: avaliationSpace },
                    { name: 'Rapidez', media: avaliationTime },
                    { name: 'Facilidade', media: avaliationEase },
                ],
                qtd: qtdAvaliation
            };
            // obter avaliação
            // ----------------------------------------------------------------------------
            const totalCollection = (totalCollectionCleaningService + totalCollectionTaxed + totalCollectionReservartion);
            const totalCollectionDetails = [
                { category: 'Reservas', value: totalCollectionReservartion },
                { category: 'Cancelamentos', value: totalCollectionTaxed },
                { category: 'Limpezas', value: totalCollectionCleaningService }
            ]; //detalhes de valores arrecadados para grafico 1
            const reservationMadeDetails = [
                { name: 'Finalizadas', value: allReservationFinished },
                { name: 'Aprovadas', value: allReservationProgress },
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
                Avaliation: avaliation,
                WithMoreReservation: withMoreReservation,
            });
        });
    }
}
exports.ViewDashboardServices = ViewDashboardServices;
