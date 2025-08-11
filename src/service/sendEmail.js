import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html, attachments }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"eslam 😗" ${process.env.EMAIL}`,
    to: to || "eslam.mohamed0502@gmail.com",
    subject: subject || "Hello",
    html: html || "<b>Hello</b>",
    attachments: attachments || [],
  });


  if (info.accepted.length > 0) {
    return true;
  } else {
    return false;
  }
};