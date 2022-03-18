const axios = require("axios");
const verifyUser = require("./modules/verifyUser");

const authorized = async () => {
  await verifyUser();
};

authorized();

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  const lastname = e.target.nom.value;
  const firstname = e.target.prenom.value;
  const email = e.target.mailPerso.value;

  try {
    const rep = await axios.post(
      "http://localhost:3001/profil",
      {
        lastname,
        email,
        firstname,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(rep);
  } catch (err) {
    console.log(err.message);
  }
});
