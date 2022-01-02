import Mailer from "nodemailer";

const sendEmail=async(data)=>{
    const transporter=Mailer.createTransport({
        service:process.env.SMPT_SERVICE,
        auth:{
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD
        }
    })
    const mailData={
        from:process.env.SMPT_MAIL,
        to:data.email,
        subject:data.subject,
        text:data.message
    }
    await transporter.sendMail(mailData);

}
export default sendEmail