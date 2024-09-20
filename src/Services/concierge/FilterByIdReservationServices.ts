import prismaClient from "../../prisma";

class FilterByIdReservationServices{
    async execute(reservation_id:string){

        if (!reservation_id){
            throw new Error("Insira o ID da reserva");
        }


        const addZero = (value:number) =>{
            if(value < 10){
                return `0${value}`
            }else{
                return `${value}`
            }
        }

        const date = new Date();

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const data = `${addZero(year)}${addZero(month)}${addZero(day)}`
        const dateInt = parseInt(data);
        
        const reservation = await prismaClient.reservation.findFirst({
            where:{
                id:reservation_id
            },select:{
                id:true,
                apartment:{
                    select:{
                        numberApt:true,
                        tower:{
                            select:{
                                numberTower:true
                            }
                        }
                    }
                },cleaningService:true,
                date:true,
                start:true,
                finish:true,
                name:true,
                phone_number:true,
                GuestList:{
                    select:{
                        attended:true,
                        id:true,
                        name:true,
                        rg:true
                    },orderBy:{
                        name:'asc'
                    }
                }
            }
        });


        return {reservation, isEditable:dateInt === reservation.date ? true : false}
    }
}

export {FilterByIdReservationServices}