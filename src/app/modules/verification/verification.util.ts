
import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { emailOtpTemplate } from './verification.template';
import config from '../../config';





const generateOtp = (): string => {
  const otp = Math.floor(100000 + Math.random() * 900000); // Generates a number between 100000 and 999999
  return otp.toString();
};
//vgvl ktmf yauu kovx
const sendEmail = (email: string, otp: string): Promise<string> => {
  // Create the transporter with its type
  const transporter: Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.gmail_smtp_email,
      pass: config.gmail_smtp_pass,
    },
  });


  
  // Email configuration with its type
  const mailOptions: SendMailOptions = {
    from: 'No Reply <abdullah.mamun.0110@gmail.com>' ,
    to: email,
    subject: 'Reset Password',
    html: emailOtpTemplate(otp)
  };

  // Send the email and return a Promise for async handling
  return new Promise((resolve, reject) =>  {
    transporter.sendMail(mailOptions, (err: Error | null) => {
      if (err) {
        reject(new Error(err.message)); // Use a rejected Promise for errors
      } else {
      
        resolve(`Otp sent to the ${email} successfully`); // Resolve the promise if email is sent successfully
      }
    });
  });
};
export { generateOtp, sendEmail };
