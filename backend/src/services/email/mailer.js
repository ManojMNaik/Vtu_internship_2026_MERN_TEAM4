import nodemailer from "nodemailer";
import { env } from "../../config/env.js";

const hasSmtpConfig = Boolean(env.smtpHost && env.smtpUser && env.smtpPass);

const createTransporter = () => {
  if (!hasSmtpConfig) {
    return nodemailer.createTransport({ jsonTransport: true });
  }

  return nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    connectionTimeout: 30_000,
    greetingTimeout: 30_000,
    socketTimeout: 60_000,
    pool: true,
    maxConnections: 3,
    maxMessages: 50,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
    tls: { rejectUnauthorized: false },
  });
};

let transporter = createTransporter();

export const sendEmail = async ({ to, subject, html, attachments }) => {
  try {
    const info = await transporter.sendMail({
      from: env.smtpFrom,
      to,
      subject,
      html,
      attachments,
    });

    if (!hasSmtpConfig && env.nodeEnv !== "production") {
      console.log("Email preview (dev json transport):", info.message);
    }

    return info;
  } catch (error) {
    console.error("Email send failed:", {
      to,
      subject,
      message: error?.message || "Unknown SMTP error",
    });

    if (error?.code === "ETIMEDOUT" || error?.code === "ESOCKET") {
      transporter.close();
      transporter = createTransporter();
    }

    throw error;
  }
};
