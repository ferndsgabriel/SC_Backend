import prismaClient from "../../prisma";

interface DeleteGuestProps {
    Guest: string[];
}

class DeleteGuestServices {
    async execute(deleteGuest: DeleteGuestProps) {
        if (!deleteGuest || !Array.isArray(deleteGuest.Guest) || deleteGuest.Guest.length === 0) {
            throw new Error('Envie todos os dados');
        }
        for (const item of deleteGuest.Guest) {
            try {
                const existingGuest = await prismaClient.guest.findUnique({
                    where: { id: item }
                });

                if (!existingGuest) {
                    continue; 
                }
                await prismaClient.guest.delete({
                    where: { id: item }
                });

            } catch (error) {
                if (error.code === 'P2025') {
                    console.warn('error')
                } else {
                    console.error(error);
                }
            }
        }

        return { ok: true };
    }
}

export { DeleteGuestServices };
