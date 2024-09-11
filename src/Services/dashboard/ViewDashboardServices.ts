import prismaClient from "../../prisma";
import dateInInt from "../../utils/DateInInt";

interface aptProps {
    payment: boolean;
}

interface dashBoardProps {
    period: Date;
}

class ViewDashboardServices {
    async execute({ period }: dashBoardProps) {
        // Consulta para moradores
        const allUsersInSystem = await prismaClient.user.findMany({
            where: {
                createDate: {
                    lte: period
                }
            }
        });
        const totalUsers = allUsersInSystem.length ?? 0;

        // Consulta para administradores
        const allAdminsInSystem = await prismaClient.adm.findMany({
            where: {
                createDate: {
                    lte: period
                }
            }
        });
        const totalAdmins = allAdminsInSystem.length ?? 0;

        // Consulta para torres
        const allTowersInSystem = await prismaClient.tower.findMany();
        const totalTowers = allTowersInSystem.length ?? 0;

        // Consulta para apartamentos (sem filtro de data)
        const allApartmentsInSystem = await prismaClient.apartment.findMany({
            select: {
                payment: true,
                user: true
            }
        });
        const totalApartments = allApartmentsInSystem.length ?? 0;

        // Consulta para reservas (aplicando filtro de data)
        const allReservationsInSystem = await prismaClient.reservation.findMany({
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
        const totalReservations = allReservationsInSystem.length ?? 0;

        // Consulta para reservas canceladas (aplicando filtro de data)
        const allCanceledReservationsInSystem = await prismaClient.isCanceled.findMany({
            where: {
                createDate: {
                    lte: period
                }
            }
        });
        const totalCanceledReservations = allCanceledReservationsInSystem.length ?? 0;

        // Total de reservas feitas (soma de reservas normais e canceladas)
        const totalReservationsMade = (totalCanceledReservations + totalReservations) ?? 0;

        // Reservas em análise (aplicando filtro de data)
        const reservationsUnderAnalysis = allReservationsInSystem.filter(item => item.reservationStatus === null);
        const totalReservationsUnderAnalysis = reservationsUnderAnalysis.length ?? 0;

        // Reservas finalizadas e em progresso (aplicando filtro de data)
        const now = new Date();
        const reservationsFinished = allReservationsInSystem.filter(item => item.date < dateInInt(now, 0) && item.reservationStatus === true);
        const reservationsInProgress = allReservationsInSystem.filter(item => item.date > dateInInt(now, 0) && item.reservationStatus === true);
        const totalReservationsFinished = reservationsFinished.length ?? 0;
        const totalReservationsInProgress = reservationsInProgress.length ?? 0;

        // Total de hóspedes (aplicando filtro de data)
        const guestsList: string[] = [];
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
        const totalTaxedReservations = taxedReservations.length ?? 0;

        // Apartamentos ocupados (sem filtro de data)
        const apartmentsWithOccupancy = allApartmentsInSystem.filter(item => item.user.length > 0);
        const compliantApartments = apartmentsWithOccupancy.filter(item => item.payment);
        const defaulterApartments = apartmentsWithOccupancy.filter(item => !item.payment);
        const totalCompliantApartments = compliantApartments.length ?? 0;
        const totalDefaulterApartments = defaulterApartments.length ?? 0;

        // Arrecadação (aplicando filtro de data)
        const taxRate = 80;
        const totalCollectionTaxed = totalTaxedReservations * taxRate ?? 0;

        const cleaningServiceRate = 80;
        const reservationsWithCleaningService = reservationsFinished.filter(item => item.cleaningService);
        const totalCollectionCleaningService = reservationsWithCleaningService.length * cleaningServiceRate ?? 0;

        const reservationRate = 100;
        const totalCollectionReservations = totalReservationsFinished * reservationRate ?? 0;

        // Avaliações (aplicando filtro de data)
        const allAvaliation = await prismaClient.avaliations.findMany({
            where: {
                createDate: {
                    lte: period
                }
            }
        });
        const totalAvaliation = allAvaliation.length ?? 0;

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
        async function getTop3ApartmentsWithMostReservations() {
            const topApartments = await prismaClient.apartment.findMany({
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

            return topApartments.map(apartment => ({
                ...apartment,
                percentage: ((apartment._count.Reservations / totalReservations) * 100 || 0).toFixed(2)
            }));
        }

        const topApartments = await getTop3ApartmentsWithMostReservations();

        const rawData = topApartments.map(item => ({
            name: item._count.Reservations > 0 ? `Torre ${item.tower.numberTower} - Apartamento ${item.numberApt}` : '',
            reservas: item._count.Reservations
        }));

        const withMoreReservations = rawData.sort((a, b) => b.reservas - a.reservas);

        // Resultados finais
        return {
            TotalCollection: (totalCollectionCleaningService + totalCollectionTaxed + totalCollectionReservations).toFixed(2) ?? '0.00',
            Users: totalUsers ?? 0,
            Adms: totalAdmins ?? 0,
            Apartaments: totalApartments ?? 0,
            Towers: totalTowers ?? 0,
            TotalCollectionDetails: [
                { category: 'Reservas', value: totalCollectionReservations },
                { category: 'Cancelamentos', value: totalCollectionTaxed },
                { category: 'Limpezas', value: totalCollectionCleaningService }
            ],
            AllReservationMade: totalReservationsMade ?? 0,
            ReservationMadeDetails: [
                { name: 'Finalizadas', value: totalReservationsFinished ?? 0 },
                { name: 'Aprovadas', value: totalReservationsInProgress ?? 0 },
                { name: 'Em Análise', value: totalReservationsUnderAnalysis ?? 0 },
                { name: 'Canceladas', value: totalCanceledReservations ?? 0 }
            ],
            OccupancyRate: [
                { name: 'Ocupado', value: parseFloat(averageGuestsPerReservation) ?? 0, limite: 30 },
                { name: 'Disponível', value: 30 - parseFloat(averageGuestsPerReservation) }
            ],
            Payers: [
                { category: 'Moradores', Adimplentes: totalCompliantApartments ?? 0, Inadimplentes: totalDefaulterApartments ?? 0 }
            ],
            Avaliation: {
                data: [
                    { name: 'Limpeza', media: averageAvaliationHygiene ?? '0.00' },
                    { name: 'Espaço', media: averageAvaliationSpace ?? '0.00' },
                    { name: 'Rapidez', media: averageAvaliationTime ?? '0.00' },
                    { name: 'Facilidade', media: averageAvaliationEase ?? '0.00' }
                ],
                qtd: totalAvaliation ?? 0
            },
            WithMoreReservation: withMoreReservations
        };
    }
}

export { ViewDashboardServices };
