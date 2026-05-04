import { env } from "../../config/env.js";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const MAX_RETRIES = 2;
const TIMEOUT_MS = 5000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const buildBrevoPayload = ({ to, subject, html, attachments }) => {
  const payload = {
    sender: {
      name: env.brevoSenderName,
      email: env.brevoSenderEmail,
    },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  };

  if (attachments?.length) {
    payload.attachment = attachments.map((att) => ({
      name: att.filename,
      content: Buffer.isBuffer(att.content)
        ? att.content.toString("base64")
        : att.content,
    }));
  }

  return payload;
};

export const sendEmail = async ({ to, subject, html, attachments }) => {
  const payload = buildBrevoPayload({ to, subject, html, attachments });

  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const response = await fetch(BREVO_API_URL, {
        method: "POST",
        headers: {
          "api-key": env.brevoApiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(
          `Brevo API ${response.status}: ${errorBody.message || response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      const isLastAttempt = attempt > MAX_RETRIES;

      if (isLastAttempt) {
        console.error("[Brevo Email Error]", {
          to,
          subject,
          attempt,
          message: error.message,
        });
        return null;
      }

      console.warn(`[Brevo Email] Attempt ${attempt} failed, retrying...`, error.message);
      await sleep(500 * attempt);
    }
  }
};
