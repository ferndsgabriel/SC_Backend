import { FormatPhone } from "./FormatPhone";
import prismaClient from "../prisma";
import { Resend } from 'resend';
const Vonage = require('@vonage/server-sdk').default; // Importe Vonage desta forma

export async function SendAlertsAdm(number:string, message:string) {
    const myNumber = FormatPhone(number);
    

    async function handlephone() {
        const vonage = new Vonage({
            apiKey: process.env.VONAGEKEY,
            apiSecret: process.env.VONAGESECRET
        });
        const from = "Vonage APIs";
        const to = `+55${myNumber}`;
        const text = message;

        try {
            const resp = await vonage.message.sendSms(from, to, text);
            console.log('SMS enviado');
            console.log(resp);
        } catch (err) {
            console.log('SMS não enviado');
            console.error(err);
        }
    }

    async function handleEmail() {
        const email = await prismaClient.adm.findFirst({
            where: {
                phone_number: myNumber
            },
            select: {
                email: true
            }
        });

        const notspace = email.email.trim();
        const lowercase = notspace.toLowerCase();
        const sendEmail = lowercase.toString();

        //
        const resend = new Resend(process.env.RESEND_API);
        try {
            const data = await resend.emails.send({
                from:process.env.RESEND_FROM,
                to:sendEmail,
                subject: 'Email de Salão Condo',
                html: message,
                });
                console.log(data);
                console.log('Email enviado')
            } catch (error) {
                console.log('Email não enviado');
            }  
        } 

    await handleEmail();
    //await  handlephone();
}     
        
