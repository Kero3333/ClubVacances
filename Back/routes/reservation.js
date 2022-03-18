const router = require("express").Router();
const axios = require("axios");
const nodemailer = require("nodemailer");
require("dotenv").config();

const verifyToken = require("../middlewares/verifyToken");

router.use(verifyToken);

router.post("", async (req, res) => {
  let { start_date, end_date, cook, location, visit, message } = req.body;

  const difference = (date1, date2) => {
    const date1utc = Date.UTC(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate()
    );
    const date2utc = Date.UTC(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate()
    );
    day = 1000 * 60 * 60 * 24;
    return (date2utc - date1utc) / day;
  };

  const date1 = new Date(start_date);
  const date2 = new Date(end_date);
  const time_difference = difference(date1, date2);

  if (time_difference < 7 || time_difference > 31) {
    return res.status(400).send("erreur durée du séjour");
  }

  const {
    data: { id, firstname, lastname, email },
  } = await axios.get("http://localhost:1337/api/users/me", {
    headers: {
      Authorization: req.headers.authorization,
      "Content-Type": "application/json",
    },
  });

  try {
    // on vérifie de la disponibilité de la location
    let url = `http://localhost:1337/api/reservations?populate[location][filters][id][$eq]=${location}&filters[end_date][$lte]=${end_date}&filters[$or][0][start_date][$gte]=${start_date}&filters[$or][1][end_date][$gte]=${start_date}`;
    let options = {
      method: "get",
      url: url,
      headers: {
        Authorization: req.headers.authorization,
        "Content-Type": "application/json",
      },
    };

    const {
      data: { data },
    } = await axios(options);

    const alreadyReserved = data.filter(
      (reservation) => reservation.attributes.location.data !== null
    );
    if (alreadyReserved.length !== 0) {
      return res.status(400).send("reservation non disponible à cette date");
    }

    // on enregistre la réservation
    try {
      options.url = `http://localhost:1337/api/reservations`;
      options.method = "post";
      options.data = {
        data: { start_date, end_date, cook, location, visit, user: id },
      };

      const {
        data: { data: rep },
      } = await axios(options);

      // on envoie un email à l'admin
      message += `
      http://localhost:1337/admin/content-manager/collectionType/api::reservation.reservation/${rep.id}`;

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
        subject: `${firstname} ${lastname} <${email}> Demande de réservation`,
        text: `${message}`,
      };

      transporter.sendMail(mailOpts, (err, response) => {
        if (err) {
          res.send(err.message);
        } else {
          return res.status(201).send(rep);
        }
      });
    } catch (err) {
      return res.status(400).send(err.message);
    }
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

module.exports = router;
