import prismaClient from "../../prisma";
import dateInInt from "../../utils/DateInInt";


interface aptProps{
    payment:boolean,
}
interface dashBoardProps {
    period:number
}

class ViewDashboardServices{
    async execute({period}:dashBoardProps){
        
        const nowDate = new Date();
        const lessThirtyDay = new Date();
        const lessSixMonth = new Date();
        const allTime = new Date();
        lessThirtyDay.setDate(nowDate.getDate() - 30);
        lessSixMonth.setMonth(nowDate.getMonth() - 6);
        allTime.setFullYear(2024);
        allTime.setMonth(0);
        allTime.setDate(1);

        const AllTimes = [allTime, lessSixMonth, lessThirtyDay]

        const allUserInSystem = await prismaClient.user.findMany({
            where:{
                createDate:{
                    gt:AllTimes[period]
                }
            }
        });
        const allUser = allUserInSystem.length;

        //------------------------------------------- qtd moradores
        const allAdmInSystem = await prismaClient.adm.findMany({
            where:{
                createDate:{
                    gt:AllTimes[period]
                }
            }
        });
        const allAdm = allAdmInSystem.length;

        //------------------------------------------- qtd adm
        const allTowerInSystem = await prismaClient.tower.findMany({
        });
        const allTower = allTowerInSystem.length;
        //------------------------------------------- qtd torre
        const allAptInSystem = await prismaClient.apartment.findMany({select:{payment:true,user:true}});
        const allApt = allAptInSystem.length;
        //------------------------------------------- qtd apartamento
        const allReservationInSystem = await prismaClient.reservation.findMany({
            where:{
                createDate:{
                    gt:AllTimes[period]
                }
            },
            select:{
                start:true,
                finish:true,
                cleaningService:true,
                approvalDate:true,
                createDate:true,
                guest:true,
                date:true,
                reservationStatus:true
            }
        });

        //------------------------------------------- qtd de reservas já feitas pelo sistema
        const reservationUnderAnalysis = [];
        allReservationInSystem.forEach((item)=>{
            if (item.reservationStatus === null){
                reservationUnderAnalysis.push(item);
            }
        });
        const reservationUnderAnalysisQtd = reservationUnderAnalysis.length;

        //------------------------------------------- qtd de reservas em analise
        const now = new Date();
        const allReservationFinishedInSystem = <object[]>[];
        const allReservationConfirmed = <object[]>[];

        allReservationInSystem.forEach((item)=>{
            if (item.date < dateInInt(now, 0) && item.reservationStatus === true ){
                allReservationFinishedInSystem.push(item)
            }else if (item.date > dateInInt(now, 0) && item.reservationStatus === true ){
                allReservationConfirmed.push(item)
            }
        })
        const allReservationFinished = allReservationFinishedInSystem.length;
        const allReservationProgress = allReservationConfirmed.length;

        //------------------------------------------- qtd de reservas já realizadas
        const allReservationCanceledInSystem = await prismaClient.isCanceled.findMany({
            where:{
                createDate:{
                    gt:AllTimes[period]
                }
            }
        });
        const allTaxedInSystem = [];
        const allCanceledSystem = [];
        
        allReservationCanceledInSystem.forEach((item)=>{
            if (item.isTaxed === true){
                allTaxedInSystem.push(item);
            }else{
                allCanceledSystem.push(item)
            }
        });
        const allTaxed = allTaxedInSystem.length;
        const allTCanceled = allCanceledSystem.length;

        //------------------------------------------- qtd de reservas taxadas e canceladas
        function calcAverage(start:number[]) {
            let totalMinutos = 0;
            for (let i = 0; i < start.length; i++) {
                let horas = Math.floor(start[i] / 100);
                let minutos = start[i] % 100;
                totalMinutos += horas * 60 + minutos;
            }
            let mediaMinutos = totalMinutos / start.length;
            return mediaMinutos;
        }
        function convertToMinutes(time:number) {
            let hours = Math.floor(time / 100);
            let minutes = time % 100;
            return hours * 60 + minutes;
        }
        function convertMinutesToHoursAndMinutes(minutes:number) {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = Math.round(minutes % 60); 
            return `${hours}h:${remainingMinutes}min`;
        }

        const listStart = <number[]>[];

        allReservationInSystem.forEach((item)=>{
            const date = item.start;
            listStart.push(date);
        });

        const reservationStartAverageMinute = calcAverage(listStart);
        const reservationStartAverage = convertMinutesToHoursAndMinutes(reservationStartAverageMinute);

        //------------------------------------------- media do horario de inicio
        const listFinish = <number[]>[];

        allReservationInSystem.forEach((item)=>{
            const date = item.finish;
            listFinish.push(date);
        });

        const reservationFinishAverageMinute = calcAverage(listFinish);
        const reservationFinishAverage = convertMinutesToHoursAndMinutes(reservationFinishAverageMinute);
        //------------------------------------------- media do horario de término
        const listDuration: number[] = [];

        allReservationInSystem.forEach((item) => {
            const duration = convertToMinutes(item.finish - item.start);
            listDuration.push(duration);
        });
        let total = 0;
        
        listDuration.forEach((item) => {
            total += item;
        });
        
        const reservationDurationAverage = convertMinutesToHoursAndMinutes(total / allReservationInSystem.length);
        //------------------------------------------- media de duração
        const apartmentCompliant = <object[]> [];
        const apartmentDefaulter = <object []> [];
        const AllAptOcupation = <object []> [];

        allAptInSystem.forEach((item)=>{
            if (item.user.length > 0){
                AllAptOcupation.push(item);
            }
        });
        AllAptOcupation.forEach((item:aptProps)=>{
            if (item.payment){
                apartmentCompliant.push(item)
            }else{
                apartmentDefaulter.push(item)
            }
        })

        const allCompliant = apartmentCompliant.length;
        const allDefaulter = apartmentDefaulter.length;

        const compliantPercentage = ((allCompliant/AllAptOcupation.length)*100);
        const defaulterPercentage = ((allDefaulter/AllAptOcupation.length)*100);

        //------------------------------------------- total de adimplente e adimplentes
        const rateValueTaxed = 80; // Valor da taxa de reserva
        const totalCollectionTaxed = (allTaxed * rateValueTaxed);
        //------------------------------------------- total arrecadado com taxas
        const listReservationWithCleaningServices = <object []>[];
        const rateCleaningService = 80;

        allReservationFinishedInSystem.forEach((item:any)=>{
            if (item.cleaningService){
                listReservationWithCleaningServices.push(item);
            }
        });

        const totalCollectionCleaningService = (listReservationWithCleaningServices.length * rateCleaningService);
        //------------------------------------------- total arrecadado com serviço de limpeza
        const rateValueReservation = 100
        const totalCollectionReservartion =  (allReservationFinished*rateValueReservation);
        //------------------------------------------- total arrecadado com reservas

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


        const listAllRequestDate = <Date[]>[]
        const listAllApprovalDate = <Date[]>[]

        allReservationInSystem.forEach((item)=>{
            if (item.approvalDate !== null && item.createDate !== null){
                listAllApprovalDate.push(item.approvalDate);
                listAllRequestDate.push(item.createDate);
            }
        });

        const timeApproveReservationMinutes = calculateAverageApprovalTime(listAllRequestDate, listAllApprovalDate)
        const timeApproveReservation = convertMinutesToHoursAndMinutes(timeApproveReservationMinutes);
        //------------------------------------------- tempo para uma reserva ser aprovada
        const thereGuest = <string[]> [];
        let totalGuests = 0;
        const limitGuest = 20;

        allReservationInSystem.forEach((item)=>{
            if (item.guest){
                thereGuest.push(item.guest);
            }
        });
        thereGuest.forEach(item => {
            const names = item.split(',');
            totalGuests += names.length;
        });
        
        const occupancyRate = (((totalGuests)/(limitGuest*thereGuest.length))*100).toFixed(1);
        //------------------------------------------- taxa de ocupação
        const withAvaliation = await prismaClient.avaliations.findMany({
            where:{
                createDate:{
                    gt:AllTimes[period]
                }
            }
        });
        const qtdAvaliation = withAvaliation.length;

        let totalAvaliation = 0;
        withAvaliation.forEach((item)=>{
            totalAvaliation += item.value;
        });

        const averageAvaliation = (totalAvaliation/qtdAvaliation);
        // ------------------------------------------------- avaliation
        async function getTop3ApartmentsWithMostReservations() {
                const topApartments = await prismaClient.apartment.findMany({
                    where:{
                        Reservations:{
                            every:{
                                createDate:{
                                    gt:AllTimes[period]
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
                    return {
                    ...apartment,
                    percentage: percentage.toFixed(0),
                    };
            });
            
            return apartmentsWithPercentage;
        }

        const topApartments = await getTop3ApartmentsWithMostReservations();

        // ------------------------------------------------- users more reservation
        const totalCollection = (totalCollectionCleaningService + totalCollectionTaxed + totalCollectionReservartion);

        const collection =     
            [
                {
                    qtd:allTaxed,
                    name:'Taxa',
                    money:totalCollectionTaxed,
                    percentage:((totalCollectionTaxed/totalCollection)*100).toFixed(1),
                },
                {
                    qtd:listReservationWithCleaningServices.length,
                    name:'Limpeza',
                    money:totalCollectionCleaningService,
                    percentage:((totalCollectionCleaningService/totalCollection)*100).toFixed(1),
                },
                {
                    qtd:allReservationFinished,
                    name:'Reserva',
                    money:totalCollectionReservartion,
                    percentage:((totalCollectionReservartion/totalCollection)*100).toFixed(1),
                }
            ]
        
        collection.sort((a, b) => a.qtd - b.qtd);
        const users = [{qtd:allUser, name:'Moradores'}, {qtd:allAdm, name:'Administradores'}];
        const residences = [{qtd:allTower, name:'Torres'}, {qtd:allApt, name:'Apartamentos'}];
            
        const statusApartment = [
                {
                    name:'Adimplentes',
                    qtd:allCompliant,
                    Percentage:compliantPercentage
                },
                {
                    name:'Inadimplentes',
                    qtd:allDefaulter,
                    Percentage:defaulterPercentage
                },
            ]

        const avaliation = {
            qtd:qtdAvaliation,
            average:averageAvaliation
        }

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
        
        


        return (
            {
                Collection:collection,
                TotalCollection:totalCollection, 
                Users:users,
                Residences:residences,
                StatusApartment:statusApartment,
                OccupancyRate:occupancyRate,
                Avaliation:avaliation,
                UsersRating:true,
                Reservations:reservations,
                TotalReservation:reservationTotal,
                TopApartments:topApartments,
                AverageStartReservation:reservationStartAverage,
                AverageFinishReservation:reservationFinishAverage,
                AverageDurationReservation:reservationDurationAverage,
                TotalCollectionTaxed:totalCollectionTaxed,
                TimeApproveReservation:timeApproveReservation,
            }
        )
    }
}

export {ViewDashboardServices}