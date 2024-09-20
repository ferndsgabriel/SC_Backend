import { lte } from "lodash";
import prismaClient from "../../prisma"



class FilterTodayReservationsServices{
    async execute(){
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

        const getReservations = await prismaClient.reservation.findMany({
            where:{
                date:{
                    equals:dateInt
                },
                reservationStatus:true
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
                    }
                }
            },
            orderBy:{
                date:"desc"
            }
        });


        return getReservations;

    }
}

export {FilterTodayReservationsServices}