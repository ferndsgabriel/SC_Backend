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
    await new Promise((resolve, reject) => {
        // verify connection configuration
        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log("Server is ready to take our messages");
                resolve(success);
            }
        });
    });
    await new Promise((resolve, reject) => {
        transporter.sendMail({
            from:user,
            to:myEmail,
            subject:'Email de salãoCondo',
            html:message
        }).then((inf)=>{
            console.log('sucess');
        }).catch((e)=>{
            console.log(e)
        })
    });
}     