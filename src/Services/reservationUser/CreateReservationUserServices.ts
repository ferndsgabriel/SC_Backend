import prismaClient from "../../prisma";
import { SendEmail } from "../../utils/SendEmail";

interface agendamentoRequest{
    user_id: string,
    date: number,
    cleaning:boolean,
    start:string,
    finish:string,
}

class CreateReservationUserServices{
    async execute({ date, cleaning,start,finish, user_id}:agendamentoRequest){
        

        if (!user_id || !date || cleaning === null || !start || !finish){
            throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
        }

        const dateString = date.toString();

        if (dateString.length % 8){
            throw new Error ("date inválida");
        }

        const year = dateString.substring(0,4);
        const month = dateString.substring(4,6);
        const day = dateString.substring(6,8); 

        const yearInt = parseInt(year);
        const monthInt = parseInt(month);
        const dayInt = parseInt(day);

        const onDay = new Date();
        const actuallyYear = onDay.getFullYear();

        const reservationDate = new Date();
        reservationDate.setFullYear(yearInt);
        reservationDate.setMonth(monthInt-1); 
        reservationDate.setDate(dayInt);

        if (actuallyYear > yearInt){
            throw new Error('Data inválida, ex: "ano/mês/dia');
        }

        if (monthInt < 1 || monthInt > 12 ){
            throw new Error('Data inválida, ex: "ano/mês/dia');
        }

        if (dayInt < 1 || dayInt > 31 ){
            throw new Error('Data inválida, ex: "ano/mês/dia');
        }

        if (onDay > reservationDate){
            throw new Error('Data antiga!');
        }

        if (start.toString().length % 4 || finish.toString().length % 4  ){
            throw new Error ("Horário inválido");
        }

        const parseIntFinish = parseInt (finish);
        const parseIntStart = parseInt (start);

        if (parseIntFinish < parseIntStart){
            throw new Error ("Horário inválido");
        }

        const user = await prismaClient.user.findFirst({
            where:{
                id:user_id
            },select:{
                name:true,
                lastname:true,
                email:true,
                phone_number:true,
                apartment:{
                    select:{
                        tower_id:true,
                        id:true
                    }
                }
            }
        });

        if (!user){
            throw new Error ('Usuário inválido!');
        }

        const pagamentoactive = await prismaClient.apartment.findFirst({
            where:{
                id:user.apartment.id,
                payment:true
            }
        });

        if (!pagamentoactive){
            throw new Error ("O pagamento do seu condomínio está pendente. Se já efetuou o pagamento, por favor, entre em contato com a administração.")
        }

        const agendamentoExist = await prismaClient.reservation.findFirst({
            where:{
                date:date,
                apartment:{
                    tower_id:user.apartment.tower_id
                },
                reservationStatus:true,
            }
        })

        if (agendamentoExist){
            throw new Error ("Uma reserva já foi confirmada nessa data");
        }

        const itsMy = await prismaClient.reservation.findFirst({
            where:{
                apartment_id:user.apartment.id,
                date:date
            }
        })

        if (itsMy){
            throw new Error ("Você já soliciitou uma reserva pra esse dia");
        }

        if (start >= finish){
            throw new Error ('O horário de início da reserva não pode ser posterior ou igual ao término.')
        }

        const createReservation = await prismaClient.reservation.create({
            data:{
                cleaningService:cleaning,
                apartment_id:user.apartment.id,
                date:date,
                start:parseIntStart,
                finish:parseIntFinish,
                email:user.email,
                phone_number:user.phone_number,
                name:`${user.name} ${user.lastname}`
            },select:{
                id:true,
                apartment:true,
                cleaningService:true,
                date:true,
                start:true,
                finish:true
            }
        })
        const admEmail = await prismaClient.adm.findMany({
            select:{
                email:true
            }
        });
        
        function formatDate(date:number){
            const string = date.toString();
            const year = string.substring(0,4);
            const month = string.substring(4,6);
            const day = string.substring(6,8);

            return `${day}/${month}/${year}`;
        }

        function formatHours(number:number){
            const string = number.toString();
            const hours = string.substring(0,2);
            const minutes = string.substring(2,4);

            return `${hours}:${minutes}`;
        }
        
        const message = `
        <p>Olá, administrador do SalãoCondo,</p>
        
        <p>Uma nova reserva foi solicitada para o dia ${formatDate(createReservation.date)}, das ${formatHours(createReservation.start)} às ${formatHours(createReservation.finish)}.</p>
        
        <p>Não deixe o morador esperando. Aprove ou reprove a reserva o mais rápido possível!</p>
        
        <p>Atenciosamente,<br>
        SalãoCondo</p>
    `;
    
        for (var x = 0; x < admEmail.length; x++) {
            const getEmail = admEmail[x].email; 
            SendEmail(getEmail, message);
        }  

        return (createReservation);
    }
}

export {CreateReservationUserServices}