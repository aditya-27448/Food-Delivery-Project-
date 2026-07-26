import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// console.log(process.env.SMTP_USER);
// console.log(process.env.SMTP_PASS);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtpMail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: "Reset Your Password",
    html: `<p>Your OTP for reset password is <b>${otp}</b> . It expires in 5 min. </p>`,
  });
};

export const sendDeliveryOtpMail = async (user, otp) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: user.email,
    subject: " Delivery OTP",
    html: `<p>Your OTP for delivery is <b>${otp}</b> . It expires in 5 min. </p>`,
  });
};
