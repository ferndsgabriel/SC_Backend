import prismaClient from "../../prisma";
import { SendEmail } from "../../utils/SendEmail";

interface AgendamentoRequest {
    reservation_id: string;
    status: boolean;
}

class SetNewReservationServices {
    async execute({ reservation_id, status }: AgendamentoRequest) {

        const reservation = await prismaClient.reservation.findFirst({
            where: {
                id: reservation_id
            },
            select: {
                id: true,
                start: true,
                finish: true,
                date: true,
                apartment: {
                    select: {
                        id: true,
                        tower_id: true
                    },
                },
            }
        });

        if (!reservation) {
            throw new Error('Reserva não encontrada.');
        }

        if (status !== false) {
            const existOther = await prismaClient.reservation.findFirst({
                where: {
                    reservationStatus: true,
                    date: reservation.date,
                    apartment: {
                        tower_id: reservation.apartment.tower_id
                    },
                    finish: {
                        gte: reservation.start
                    }
                }
            });

            if (existOther) {
                throw new Error('Você já aprovou uma reserva nessa data.');
            }
        }

        const onDay = new Date();

        const updatedReservation = await prismaClient.reservation.update({
            where: {
                id: reservation_id
            },
            data: {
                reservationStatus: status,
                approvalDate:onDay
            }
        });

        let message = '';
        let eventLink = '';

        function hourGoogleCalendar(hourNumber: number): string {
            const hour = hourNumber.toString().padStart(4, '0');
            const gotHour = hour.substring(0, 2);
            const gotMinutes = hour.substring(2, 4);
            return `${gotHour}:${gotMinutes}:00`;
        }

        function dateGoogleCalendar(date: number): string {
            const dateString = date.toString();
            const year = dateString.substring(0, 4);
            const month = dateString.substring(4, 6);
            const day = dateString.substring(6, 8);
            return `${year}-${month}-${day}`;
        }

        async function getLinkGoogleCalendar() {
            const eventInit = new Date(`${dateGoogleCalendar(reservation.date)}T${hourGoogleCalendar(reservation.start)}`);
            const eventFinish = new Date(`${dateGoogleCalendar(reservation.date)}T${hourGoogleCalendar(reservation.finish)}`);
            const title = 'Reserva confirmada - SalãoCondo';
            const description = '';
            const local = '';

            const dateInitFormat = eventInit.toISOString().replace(/-|:|\.\d+/g, "");
            const dateFinishFormat = eventFinish.toISOString().replace(/-|:|\.\d+/g, "");

            const url = 'https://calendar.google.com/calendar/render?action=TEMPLATE&dates';
            eventLink = `${url}=${dateInitFormat}/${dateFinishFormat}&text=${encodeURIComponent(title)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(local)}`;
        }

        await getLinkGoogleCalendar();

        if (status) {
            message = `
            <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
                <h2 style="color: #0066ff;">🎉 SalãoCondo, sobre sua reserva do salão 🎉</h2>
                <p>Oba! Com grande alegria, informamos que sua reserva foi aceita com sucesso!</p>
                <p>Agora você pode preencher a lista de convidados para o evento. Temos certeza de que será uma ocasião especial e estamos ansiosos para recebê-lo juntamente com seus convidados.</p>
                <p>Você pode salvar sua reserva no Google Calendário através <a href="${eventLink}" style="color: #0066ff;">deste link</a>.</p>
            </div>
        `;
        
        } else {
            message = `
            <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
                <p>Prezado Morador,</p>
                <p>Lamentamos informar que não podemos aceitar a sua reserva do salão neste momento. Pedimos desculpas pela inconveniência que isso possa causar.</p><br>
                
                <p>Atenciosamente,<br>
                Equipe SalãoCondo 🌟</p>
            </div>
        `;     
        }

        const usersInApartment = await prismaClient.user.findMany({
            where: {
                apartment_id: reservation.apartment.id
            },
            select: {
                email: true,
            }
        });

        for (const user of usersInApartment) {
            SendEmail(user.email, message);
        }

        const deleteAllFalse = await prismaClient.reservation.deleteMany({
            where: {
                reservationStatus: false
            }
        });

        return updatedReservation;
    }
}

export { SetNewReservationServices };
