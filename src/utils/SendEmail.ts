import { FormatEmail } from "./FormatEmail";
import nodemailer from "nodemailer";

export async function SendEmail(email:string, message:string) {
    const myEmail = FormatEmail(email);

    const user = process.env.NODEMAILER_EMAIL;
    const pass = process.env.NODEMAILER_PASS;
    
    const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        secure:false,
        port:587 ,
        auth:{user, pass}
    });

    transporter.sendMail({
        from:user,
        to:email,
        subject:'Email de salãoCondo',
        html:message
    }).then((inf)=>{
        console.log('sucess');
    }).catch((e)=>{
        console.log(e)
    })
}     
        
