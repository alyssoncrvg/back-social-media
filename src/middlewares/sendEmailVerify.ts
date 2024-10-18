import nodemailer from 'nodemailer';
import config from '../../config';

export const sendEmail = async (to: string, subject: string, text: string) => {

    const { email, password } = config

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: email,
            pass: password,
        },
    });

    const mailOptions = {
        from: email,
        to: to,
        subject: subject,
        text: text,
    };

    await transporter.sendMail(mailOptions);
};
