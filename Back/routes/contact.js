const router = require("express").Router();
const axios = require("axios");
const nodemailer = require("nodemailer");
require("dotenv").config();

const verifyToken = require("../middlewares/verifyToken");

router.use(verifyToken);

router.post("/sponsorship", async (req, res) => {
  const { mail, message } = req.body;

  try {
    const {
      data: { firstname, lastname, email },
    } = await axios.get("http://localhost:1337/api/users/me", {
      headers: {
        Authorization: req.headers.authorization,
        "Content-Type": "application/json",
      },
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOpts = {
      to: process.env.GMAIL_USER,
      subject: `${firstname} ${lastname} <${email}> Demande de parrainage`,
      text: `mail de l'utilisateur à parrainer : ${mail}
      ${message}`,
    };

    transporter.sendMail(mailOpts, (err, response) => {
      if (err) {
        res.send(err.message);
      } else {
        return res.status(200).send("Demande envoyée");
      }
    });
  } catch (err) {
    res.send(err.message);
  }
});

router.post("/reclamation", async (req, res) => {
  const { message, email } = req.body;

  try {
    const {
      data: { firstname, lastname },
    } = await axios.get("http://localhost:1337/api/users/me", {
      headers: {
        Authorization: req.headers.authorization,
        "Content-Type": "application/json",
      },
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOpts = {
      to: process.env.GMAIL_USER,
      subject: `${firstname} ${lastname} <${email}>`,
      text: `${message}`,
    };

    transporter.sendMail(mailOpts, (err, response) => {
      if (err) {
        res.send(err.message);
      } else {
        return res.status(200).send("Message envoyée");
      }
    });
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
