import prismaClient from "../../prisma";

class FilterTodayReservationsServices {
    async execute() {
        const addZero = (value: number): string => {
            return value < 10 ? `0${value}` : `${value}`;
        };

        // Obter a data atual considerando o fuso horário de Brasília
        const today = new Date();
        const brasiliaTime = new Date(today.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));

        const year = brasiliaTime.getFullYear();
        const month = brasiliaTime.getMonth() + 1; // Mês é zero-indexado
        const day = brasiliaTime.getDate();

        // Formato YYYYMMDD
        const data = `${year}${addZero(month)}${addZero(day)}`;
        const dateInt = parseInt(data);

        const getReservations = await prismaClient.reservation.findMany({
            where: {
                date: {
                    equals: dateInt,
                },
                reservationStatus: true,
            },
            select: {
                id: true,
                apartment: {
                    select: {
                        numberApt: true,
                        tower: {
                            select: {
                                numberTower: true,
                            },
                        },
                    },
                },
                cleaningService: true,
                date: true,
                start: true,
                finish: true,
                name: true,
                phone_number: true,
                GuestList: {
                    select: {
                        attended: true,
                        id: true,
                        name: true,
                        rg: true,
                    },
                },
            },
            orderBy: {
                date: "desc",
            },
        });

        return getReservations;
    }
}

export { FilterTodayReservationsServices };
