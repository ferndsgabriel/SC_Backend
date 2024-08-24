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

        
        allReservationCanceledInSystem.forEach((item)=>{
            if (item.isTaxed === true){
                allTaxedInSystem.push(item);
            }
        });
        const allTaxed = allTaxedInSystem.length; // canceladas com taxa
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

        const allCompliant = apartmentCompliant.length; // adimplentes 
        const allDefaulter = apartmentDefaulter.length; //inadimplentes
     //----------------------------------------------------------


        const rateValueTaxed = 80; // Valor da taxa de reserva
        const totalCollectionTaxed = (allTaxed * rateValueTaxed); // arrecadado com taxas
        //----------------------------------------------------------

        const listReservationWithCleaningServices = <object []>[];
        const rateCleaningService = 80;

        ReservationFinishedInSystem.forEach((item:any)=>{
            if (item.cleaningService){
                listReservationWithCleaningServices.push(item);
            }
        });

        const totalCollectionCleaningService = (listReservationWithCleaningServices.length * rateCleaningService); // arrecadado com limpeza
        //----------------------------------------------------------
    

        const rateValueReservation = 100
        const totalCollectionReservartion =  (allReservationFinished*rateValueReservation); // arrecadado com reservas
        //----------------------------------------------------------

        const withAvaliation = await prismaClient.avaliations.findMany({
            where:{
                createDate:{
                    gte: period
                }
            },
        });
        const qtdAvaliation = withAvaliation.length;

        let totalAvaliationEase = 0;
        let totalAvaliationTime = 0;
        let totalAvaliationSpace = 0;
        let totalAvaliationHygiene = 0;

        withAvaliation.forEach((item)=>{
            totalAvaliationEase += item.ease;
            totalAvaliationTime += item.time;
            totalAvaliationSpace += item.space;
            totalAvaliationHygiene += item.hygiene
        });

        const avaliationEase = (totalAvaliationEase/qtdAvaliation); 
        const avaliationTime = (totalAvaliationTime/qtdAvaliation);
        const avaliationSpace = (totalAvaliationSpace/qtdAvaliation)
        const avaliationHygiene = (totalAvaliationHygiene/qtdAvaliation)
        // ------------------------------------------------- avaliation

        async function getTop3ApartmentsWithMostReservations() {
                const topApartments = await prismaClient.apartment.findMany({
                    where:{
                        Reservations:{
                            every:{
                                createDate:{
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
                    return {
                    ...apartment,
                    percentage: percentage.toFixed(0),
                    };
            });
            
            return apartmentsWithPercentage;
        }

        const topApartments = await getTop3ApartmentsWithMostReservations();

        const rawData = topApartments 
        ? topApartments.map(item => ({
            name: item._count.Reservations > 0 ? `Torre ${item.tower.numberTower} - Apartamento ${item.numberApt}`: '',
            reservas: item._count.Reservations
        })) 
        : [];
        
        const withMoreReservation = rawData.sort((a, b) => b.reservas - a.reservas); // moradores com mais reservas
        // ----------------------------------------------------------------------------

        const avaliation = {
                data:[
                { name: 'Limpeza', media: avaliationHygiene },
                { name: 'Espaço', media: avaliationSpace },
                { name: 'Rapidez', media: avaliationTime },
                { name: 'Facilidade', media: avaliationEase },
            ],
            qtd:qtdAvaliation
        }
        // obter avaliação
        // ----------------------------------------------------------------------------


        const totalCollection = (totalCollectionCleaningService + totalCollectionTaxed + totalCollectionReservartion);
        const totalCollectionDetails = [
            { category: 'Reservas', value:  totalCollectionReservartion},
            { category: 'Cancelamentos', value: totalCollectionTaxed}, 
            { category: 'Limpezas', value: totalCollectionCleaningService } 
      ] //detalhes de valores arrecadados para grafico 1

        const reservationMadeDetails = [
            { name: 'Finalizadas', value: allReservationFinished },
            { name: 'Aprovadas', value: allReservationProgress },
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
                Avaliation:avaliation,
                WithMoreReservation:withMoreReservation,
            }
        )
    }
}

export {ViewDashboardServices}