import { Request, Response } from "express";
import { ExcelAdmServices } from "../../Services/adm/ExcelAdmServices";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

class ExcelAdmController {
    async handle(req: Request, res: Response) {
        try {
            // Verifica se o arquivo foi enviado corretamente
            if (!req.file) {
                throw new Error('Arquivo Excel não encontrado.');
            }
            
            const excelFileBuffer = req.file.buffer; // Buffer contendo o arquivo Excel
            
            const excelAdmServices = new ExcelAdmServices();
            const excelAdm = await excelAdmServices.execute({
                excelBuffer: excelFileBuffer // Passando o buffer do arquivo Excel
            });
    
            return res.json(excelAdm);
        } catch (error) {
            console.log('Erro ao processar o arquivo Excel:', error);
            return res.status(500).json({ error: 'Erro ao processar o arquivo Excel.' });
        }
    }
}

export { ExcelAdmController, upload };
