import { lte } from "lodash";
import prismaClient from "../../prisma"


interface filterReservationsProps{
    per_page:string,
    page:string
}

class FilterOldReservationsServices{
    async execute({per_page,page}:filterReservationsProps){

        if (!per_page || !page){
            throw new Error ('Envie todos os dados');
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

        const getReservations = await prismaClient.reservation.findMany({
            where:{
                date:{
                    lt:dateInt
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
            },orderBy:{
                date:"desc"
            }
        });

        const per_page_number = parseInt(per_page);
        const pages_number = parseInt(page)
        const pagesMax = Math.ceil(getReservations.length/per_page_number); 

        const sendPage = Math.max(1, Math.min(pages_number, pagesMax));

        const sliceStart = (sendPage - 1) * per_page_number;
        const sliceEnd = (sendPage * per_page_number)
        const sliceReservations = getReservations.slice(sliceStart, sliceEnd);
        
        return {
            itens:sliceReservations,
            maxPages:pagesMax
        };

    }
}

export {FilterOldReservationsServices}