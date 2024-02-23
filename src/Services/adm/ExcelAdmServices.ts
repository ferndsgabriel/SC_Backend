import ExcelJS from 'exceljs';
import prismaClient from '../../prisma';

class ExcelAdmServices {
    async execute({ excelBuffer }) {
        if (!excelBuffer || !Buffer.isBuffer(excelBuffer)) {
            throw new Error('Envie um buffer contendo o arquivo Excel.');
        }

        function cpfMask(cpf) {
            const noSpace = cpf.trim();
            if (noSpace.length === 11) {
                const one = noSpace.substring(0, 3);
                const two = noSpace.substring(3, 6);
                const three = noSpace.substring(6, 9);
                const four = noSpace.substring(9, 11);
                return `${one}.${two}.${three}-${four}`;
            } else {
                return cpf;
            }
        }

        try {
            // Lendo o arquivo Excel a partir do buffer na memória RAM
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(excelBuffer);
            const worksheet = workbook.getWorksheet(1);

            const columnMap = {};
            worksheet.getRow(1).eachCell((cell, colNumber) => {
                columnMap[cell.text.toLowerCase()] = colNumber;
            });

            worksheet.eachRow(async (row, rowNumber) => {
                if (rowNumber === 1) return; // Ignorar cabeçalho

                const cpf = row.getCell(columnMap['cpf']).text;
                const status = row.getCell(columnMap['status']).text;

                const user = await prismaClient.user.findUnique({
                    where: {
                        cpf: cpfMask(cpf)
                    }
                });

                if (user) {
                    const apartment = await prismaClient.apartment.findUnique({
                        where: {
                            id: user.apartment_id
                        }
                    });

                    if (apartment) {
                        const paymentValue = status.toLowerCase() === 'pago' ? true : false;
                        await prismaClient.apartment.update({
                            where: {
                                id: apartment.id
                            },
                            data: {
                                payment: paymentValue
                            }
                        });
                    }
                }
            });
        } catch (error) {
            console.log('Erro ao ler o arquivo Excel:', error);
        }
    }
}

export { ExcelAdmServices };
