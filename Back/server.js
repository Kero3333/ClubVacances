const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:1234");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, x-auth-token, Authorization"
//   );
//   next();
// });

app.use(cors());

app.use(express.json());

const PORT = 3001 || process.env.PORT;

const auth = require("./routes/auth");
const location = require("./routes/locations");
const reservation = require("./routes/reservation");
const contact = require("./routes/contact");
const profil = require("./routes/profil");

app.use("/auth", auth);
app.use("/locations", location);
app.use("/reservation", reservation);
app.use("/contact", contact);
app.use("/profil", profil);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
