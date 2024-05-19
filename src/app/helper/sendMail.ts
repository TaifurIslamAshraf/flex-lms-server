import ejs from "ejs";
import nodemailer, { Transporter } from "nodemailer";
import path from "path";

import config from "../config/config";
import { IEmailOption } from "../types/mail";

export const sendMails = async (options: IEmailOption): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    port: Number(config.smtp.smtpPort),
    host: config.smtp.smtpHost,
    service: config.smtp.smtpService,
    auth: {
      user: config.smtp.smtpMail,
      pass: config.smtp.smtpPass,
    },
  });

  const { email, subject, templete, data } = options;

  const templetePath = path.join(__dirname, "../views", templete);

  //render the mail templete with ejs
  const html: string = await ejs.renderFile(templetePath, data);
  const mailOptions = {
    from: config.smtp.smtpMail,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};
