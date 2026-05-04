import axios from "axios";
import { env } from "../../config/env.js";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const MAX_RETRIES = 2;
const TIMEOUT_MS = 5000;

const getApiKey = () => {
  const key = env.brevoApiKey || process.env.BREVO_API_KEY || "";
  return key.trim();
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const sendEmail = async ({ to, subject, html, attachments }) => {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.error("[Brevo Email Error] BREVO_API_KEY is missing or empty. Email not sent.", { to, subject });
    return null;
  }

  const body = {
    sender: {
      name: (env.brevoSenderName || process.env.BREVO_SENDER_NAME || "ServiceMate").trim(),
      email: (env.brevoSenderEmail || process.env.BREVO_SENDER_EMAIL || "").trim(),
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
          "api-key": apiKey,
          "content-type": "application/json",
          accept: "application/json",
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
