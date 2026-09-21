import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpMail = async (to, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Food Bus <onboarding@resend.dev>",
      to: [to],
      subject: "Reset Your Password",
      html: `
        <p>Your OTP for password reset is 
        <b>${otp}</b>.</p>

        <p>It expires in 5 minutes.</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error(error.message);
    }

    console.log("Password reset email sent:", data.id);

    return data;
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw error;
  }
};

export const sendDeliveryOtpMail = async (user, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Food Bus <onboarding@resend.dev>",
      to: [user.email],
      subject: "Delivery OTP",
      html: `
        <p>Your OTP for delivery is 
        <b>${otp}</b>.</p>

        <p>It expires in 5 minutes.</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error(error.message);
    }

    console.log("Delivery OTP email sent:", data.id);

    return data;
  } catch (error) {
    console.error("Failed to send delivery OTP email:", error);
    throw error;
  }
};