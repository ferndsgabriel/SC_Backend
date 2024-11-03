import prismaClient from "../../prisma";
import dateInInt from "../../utils/DateInInt";


interface dashBoardProps {
    period: Date;
}

interface GuestListProps {
    id: string;
    name: string;
    rg: string;
    reservation_id: string;
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
                date: true,
                reservationStatus: true,
                acceptedDate:true,
                GuestList:{
                    select: {
                        name: true,
                        rg: true,
                        reservation_id: true,
                        id: true,
                        attended:true
                    }
                }   
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
        const reservationsMade = totalCanceledReservations + totalReservations
        // Total de reservas feitas (soma de reservas normais e canceladas)
        const totalReservationsMade = reservationsMade ?? 0;

        // Reservas em análise (aplicando filtro de data)
        const reservationsUnderAnalysis = allReservationsInSystem.filter(item => item.reservationStatus === null);
        const totalReservationsUnderAnalysis = reservationsUnderAnalysis.length ?? 0;

        // Reservas finalizadas e em progresso (aplicando filtro de data)
        const now = new Date();
        const reservationsFinished = allReservationsInSystem.filter(item => item.date < dateInInt(now, 0) && item.reservationStatus === true);
        const reservationsInProgress = allReservationsInSystem.filter(item => item.date > dateInInt(now, 0) && item.reservationStatus === true);
        const totalReservationsFinished = reservationsFinished.length ?? 0;
        const totalReservationsInProgress = reservationsInProgress.length ?? 0;

        let totalGuestsAttended = 0;
        let totalGuests = 0;
        const flatGuestsList: GuestListProps[] = [];
        let reservationsWithGuests = 0;
        
        allReservationsInSystem.forEach(item => {
            if (item.GuestList && item.GuestList.length > 0) {
                flatGuestsList.push(...item.GuestList);
                reservationsWithGuests++;
        
                totalGuestsAttended += item.GuestList.filter(guest => guest.attended === true).length;
            }
        });
        
        totalGuests = flatGuestsList.length;

        const averageGuestsAttended = reservationsWithGuests > 0 
        ? ( totalGuestsAttended / reservationsWithGuests).toFixed(0)
        : '0';
        
        const averageGuestsPerReservation = reservationsWithGuests > 0 
        ? (totalGuests / reservationsWithGuests).toFixed(0)
        : '0';
    

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
        const taxedTotal = totalTaxedReservations * taxRate;
        const totalCollectionTaxed = taxedTotal ?? 0;

        const cleaningServiceRate = 80;
        const reservationsWithCleaningService = reservationsFinished.filter(item => item.cleaningService);
        const totalCleaning = reservationsWithCleaningService.length * cleaningServiceRate
        const totalCollectionCleaningService = totalCleaning ?? 0;

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

        // Reservas por mes
        const monthsInPortuguese = [
            'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
            'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
        ];
        const formatReservationsByMonth = (reservationsData: { date: number, reservations: number }[]) => {
            const year = new Date().getFullYear();
            const currentYear = year;
            // Criar um array para armazenar o total de reservas de cada mês (inicialmente 0)
            const reservationsPerMonth = new Array(12).fill(0);
            // Filtrar e contar as reservas para cada mês
            reservationsData.forEach(item => {
                const year = Math.floor(item.date / 10000); 
                const month = Math.floor((item.date % 10000) / 100) - 1; 

            if (year === currentYear) {
                    reservationsPerMonth[month] += item.reservations;
                }
            });
            // Formatar o resultado com os nomes dos meses em português
            const result = monthsInPortuguese.map((month, index) => {
                return {
                    month,
                    reservations: reservationsPerMonth[index] || 0 // Se não houver reservas retorna 0
                };
            });
            return result;
        };

        const reservationsPerMonth = formatReservationsByMonth(
            allReservationsInSystem.map(item => ({
                date: item.date,
                reservations: 1 // Contar cada reserva individualmente
            }))
        );

        function calculateAverageApprovalTime(createDates:Date[], approvalDates:Date[]) {
            function toMinutes(timestamp:any) {
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

        function convertMinutesToHoursAndMinutes(minutes:number) {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = Math.round(minutes % 60); 
            return `${hours}h:${remainingMinutes}min`;
        }
        const listAllRequestDate = <Date[]>[]
        const listAllApprovalDate = <Date[]>[]

        allReservationsInSystem.forEach((item)=>{
            if (item.acceptedDate !== null && item.createDate !== null){
                listAllApprovalDate.push(item.acceptedDate);
                listAllRequestDate.push(item.createDate);
            }
        });
        const timeApproveReservationMinutes = calculateAverageApprovalTime(listAllRequestDate, listAllApprovalDate)
        const timeApproveReservation = convertMinutesToHoursAndMinutes(timeApproveReservationMinutes);

        // Resultados finais
        return {
            TotalCollection: (totalCollectionCleaningService + totalCollectionTaxed).toFixed(2) ?? '0.00',
            Users: totalUsers ?? 0,
            Adms: totalAdmins ?? 0,
            Apartaments: totalApartments ?? 0,
            Towers: totalTowers ?? 0,
            TotalCollectionDetails: [
                { category: 'Taxadas', value: totalCollectionTaxed },
                { category: 'Serviços de Limpeza', value: totalCollectionCleaningService }
            ],
            AllReservationMade: totalReservationsMade ?? 0,
            ReservationMadeDetails: [
                { name: 'Concluídas', value: totalReservationsFinished ?? 0 },
                { name: 'Aprovadas', value: totalReservationsInProgress ?? 0 },
                { name: 'Em Análise', value: totalReservationsUnderAnalysis ?? 0 },
                { name: 'Canceladas', value: totalCanceledReservations ?? 0 }
            ],
            OccupancyRate: { occupied: parseInt(averageGuestsPerReservation) ?? 0, limit: 30, attended: averageGuestsAttended ?? 0 },
            Payers: [
                { category: 'Adimplentes', value: totalCompliantApartments ?? 0}, 
                {category: 'Inadimplentes', value:totalDefaulterApartments ?? 0 }
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
            WithMoreReservation: withMoreReservations,
            ReservationsPerMonth:reservationsPerMonth,
            AverageTimeToAccept:timeApproveReservation
        };
    }
}

export { ViewDashboardServices };
