import { FormatEmail } from "./FormatEmail";
import nodemailer from "nodemailer";

export async function SendEmail(email:string, message:string) {
    const myEmail = FormatEmail(email);

    const user = process.env.NODEMAILER_EMAIL;
    const pass = process.env.NODEMAILER_PASS;
    
    try {	   
        await nodemailer
            .createTransport({
                host: 'smtpserver.com',
                port: 465,
                secure: true,
                auth: {
                user: user,
                pass:pass
                },
            })
        .sendMail({
            from:user,
            to:myEmail,
            html:message
        })
        console.log('Email sent to ' + email)
    } catch (e) {
        console.error(e)
    }
}     

