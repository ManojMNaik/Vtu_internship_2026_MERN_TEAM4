import axios from "axios";
import { env } from "../../config/env.js";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const MAX_RETRIES = 2;
const TIMEOUT_MS = 5000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const sendEmail = async ({ to, subject, html, attachments }) => {
  const body = {
    sender: {
      name: env.brevoSenderName,
      email: env.brevoSenderEmail,
    },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  };

  if (attachments?.length) {
    body.attachment = attachments.map((att) => ({
      name: att.filename,
      content: Buffer.isBuffer(att.content)
        ? att.content.toString("base64")
        : att.content,
    }));
  }

  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    try {
      const { data } = await axios.post(BREVO_API_URL, body, {
        headers: {
          "api-key": env.brevoApiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: TIMEOUT_MS,
      });

      return data;
    } catch (error) {
      const isLastAttempt = attempt > MAX_RETRIES;

      if (isLastAttempt) {
        console.error("[Brevo Email Error]", {
          to,
          subject,
          attempt,
          message: error.message,
          response: error.response?.data,
        });
        return null;
      }

      console.warn(`[Brevo Email] Attempt ${attempt} failed, retrying...`, error.message);
      await sleep(500 * attempt);
    }
  }
};
