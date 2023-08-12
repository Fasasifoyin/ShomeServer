import nodemailer from "nodemailer";
import Mailgen from "mailgen";

export const mail = async (req, res) => {
  const { email, firstName, lastName, text, subject } = req.body;

  let config = {
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);

  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Shome",
      link: "https://shome.js",
    },
  });

  let response = {
    body: {
      name: `${firstName} ${lastName}`,
      intro: text,
      outro: "Need help? Send a message to this email",
    },
  };

  let mail = MailGenerator.generate(response);

  let message = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    html: mail,
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res
        .status(201)
        .json({ message: "You should receive an email from us" });
    })
    .catch((error) => {
      console.log(error.message);
      return res.status(500).json({ error });
    });
};
