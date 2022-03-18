const axios = require("axios");

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const identifier = e.target.identifier.value;
  const email = e.target.mail.value;
  const password = e.target.pass.value;

  try {
    const {
      data: { jwt },
    } = await axios.post("http://localhost:3001/auth", {
      identifier,
      email,
      password,
    });
    localStorage.setItem("token", jwt);
    document.location.href = "../pages/accueil.html";
  } catch (err) {
    console.log(err.message);
  }
});
