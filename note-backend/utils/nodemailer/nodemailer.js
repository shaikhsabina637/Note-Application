import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth :{
        user:"kadarbishaikh56@gmail.com",
        pass:"hqwunynrpljhrfhx"
    }
})

export const sendEmail = async(to,subject,html)=>{
    try{
        const mailOptions = {
            from :"kadarbishaikh56@gmail.com",
            to:to,
            subject :subject,
            html:html,
        }
       const mailSend =  await transporter.sendMail(mailOptions)
       console.log("mail send info",mailSend.response)

    }catch(error){
       console.log("error while sending mail",error.message)
    }
}