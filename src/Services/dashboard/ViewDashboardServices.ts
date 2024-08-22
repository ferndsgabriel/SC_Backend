import prismaClient from "../../prisma";
import dateInInt from "../../utils/DateInInt";


interface aptProps{
    payment:boolean,
}
interface dashBoardProps {
    period:Date
}

class ViewDashboardServices{
    async execute({period}:dashBoardProps){
        

        const allUserInSystem = await prismaClient.user.findMany({
            where:{
                createDate:{
                    gte: period
                }
            }
        });
        const allUser = allUserInSystem.length;        // qtd moradores

        //----------------------------------------------------------

        const allAdmInSystem = await prismaClient.adm.findMany({
            where:{
                createDate:{
                    gte: period
                }
            }
        });
        const allAdm = allAdmInSystem.length; // qtd adm
        //----------------------------------------------------------

        const allTowerInSystem = await prismaClient.tower.findMany({
            where:{
                createDate:{
                    gte: period
                }
            }
        });
        const allTowers = allTowerInSystem.length; // qtd torre
          //----------------------------------------------------------

        const allAptInSystem = await prismaClient.apartment.findMany({
            where:{
                createDate:{
                    gte: period
                }
            },
            select:{
                payment:true,
                user:true
            }
        });
        const allApts = allAptInSystem.length; // qtd apartamento
          //----------------------------------------------------------
        
        const allReservationInSystem = await prismaClient.reservation.findMany({
            where:{
                createDate:{
                    gte: period
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
        
        const allReservationInSystemlength = allReservationInSystem.length // qtd de reservas = em analise e  aprovadas 
        //----------------------------------------------------------

        const allReservationCanceledInSystem = await prismaClient.isCanceled.findMany({
            where:{
                createDate:{
                    gte: period
                }
            }
        });

        const allCanceled = allReservationCanceledInSystem.length; // qtd de reservas canceladas
        //----------------------------------------------------------

        const allReservationMadeInSystem = (allCanceled + allReservationInSystemlength)// todas todas 
        // pego todas que estão na tabelas de reservas, analise ou aprovadas e soma com as canceladas
        //----------------------------------------------------------

        const reservationUnderAnalysis = [];

        allReservationInSystem.forEach((item)=>{
            if (item.reservationStatus === null){
                reservationUnderAnalysis.push(item);
            }
        });

        const reservationUnderAnalysisQtd = reservationUnderAnalysis.length; // qtd de reservas em analise apenas
        //----------------------------------------------------------
        const now = new Date();
        const ReservationFinishedInSystem = <object[]>[];
        const ReservationInProgress = <object[]>[];

        allReservationInSystem.forEach((item)=>{
            if (item.date < dateInInt(now, 0) && item.reservationStatus === true ){
                ReservationFinishedInSystem.push(item)
            }else if (item.date > dateInInt(now, 0) && item.reservationStatus === true ){
                ReservationInProgress.push(item)
            }
        });

        const allReservationFinished = ReservationFinishedInSystem.length; // qtd de reservas finalizadas
        const allReservationProgress = ReservationInProgress.length; // qtd de reservas em progresso
        //----------------------------------------------------------

        const theresGuest: string[] = [];
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
        
        allReservationCanceledInSystem.forEach((item)=>{
            if (item.isTaxed === true){
                allTaxedInSystem.push(item);
            }else{
                allCanceledSystem.push(item)
            }
        });
        const allTaxed = allTaxedInSystem.length; // canceladas com taxa
        const allTCanceled = allCanceledSystem.length; // apenas cancelads
     //----------------------------------------------------------
        const AllAptOcupation = <object []> [];
        const apartmentCompliant = <object[]> [];
        const apartmentDefaulter = <object []> [];
        
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

        //------------------------------------------- total de adimplente e adimplentes
        const rateValueTaxed = 80; // Valor da taxa de reserva
        const totalCollectionTaxed = (allTaxed * rateValueTaxed);
        //------------------------------------------- total arrecadado com taxas
        const listReservationWithCleaningServices = <object []>[];
        const rateCleaningService = 80;

        ReservationFinishedInSystem.forEach((item:any)=>{
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
        //------------------------------------------- tempo para uma reserva ser aprovada


        const withAvaliation = await prismaClient.avaliations.findMany({
            where:{
                createDate:{
                    gt: period
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
        
        //------------------------------------------//

        const totalCollectionDetails = [
            { category: totalCollection, Taxadas: totalCollectionTaxed, Confirmadas: totalCollectionReservartion, Limpeza: totalCollectionCleaningService }
        ]; // detalhes de valores arrecadados para grafico 1

        const reservationMadeDetails = [
            { name: 'Concluídas', value: allReservationFinished },
            { name: 'Em Andamento', value: ReservationInProgress },
            { name: 'Em Análise', value: reservationUnderAnalysisQtd},
            { name: 'Canceladas', value: allCanceled }
        ]; // detalhes sobre os numeros de cada reservas

        const limit = 30
        const  occupancyRate = [
            { name: 'Ocupado', value: averageGuestsPerReservation ? averageGuestsPerReservation : 0, limite: limit },
            {name: 'Disponível', value: averageGuestsPerReservation  ? limit -  averageGuestsPerReservation : 0 }
        ]; // taxa de ocupação 

        const payers = [
            { category: 'Moradores', Adimplentes:  allCompliant, Inadimplentes: allDefaulter },
        ]; // adimplentes x inadimplentes

        return (
            {
                TotalCollection:totalCollection, 
                Users:allUser,
                Adms:allAdm,
                Apartaments:allApts,
                Towers:allTowers,
                TotalCollectionDetails:totalCollectionDetails,
                AllReservationMade:allReservationMadeInSystem,
                ReservationMadeDetails: reservationMadeDetails,
                OccupancyRate:occupancyRate,
                Payers:payers,
                
                Collection:collection,

                Avaliation:avaliation,
                UsersRating:true,
                Reservations:reservations,
                TotalReservation:reservationTotal,
                TopApartments:topApartments,
                TotalCollectionTaxed:totalCollectionTaxed,
            }
        )
    }
}

export {ViewDashboardServices}