const axios = require("axios");
const verifyUser = require("./modules/verifyUser");

const authorized = async () => {
  await verifyUser();
};

authorized();

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.mailPerso.value;
  const message = e.target.messageReclam.value;

  try {
    const rep = await axios.post(
      "http://localhost:3001/contact/reclamation",
      {
        email,
        message,
      },
      {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNjQ3MzU0NjU4LCJleHAiOjE2NDk5NDY2NTh9.y_w_8Q5YDAUPaWBgfCLNOVqUpkkiXHHPiX23RoHeex0`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(rep);
  } catch (err) {
    console.log(err.message);
  }
});
