import { google } from "googleapis";
import path from "path";
import fs from "fs";

class DashboardAdmServices {
    async execute() {
        const keyFilePath = path.resolve(__dirname, '../../config/googlesheets.json');
        
        const credentials = require(keyFilePath);

        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const authClient = await auth.getClient();
        const spreadsheetId = '1sl7irZJyY3qaO7dLP6cP2xxrMXc2nIXtOxGTvg8EVzQ'; // ID da sua planilha
        const range = 'Sheet1!A1:D10'; // Intervalo de células a ser lido

        const sheets = google.sheets({ version: 'v4' });

        const response = await sheets.spreadsheets.values.get({
            auth: authClient as any,
            spreadsheetId,
            range,
        });

        return response.data.values;
    }
}

export default DashboardAdmServices;
