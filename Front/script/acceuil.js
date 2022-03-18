const verifyUser = require("./modules/verifyUser");

const authorized = async () => {
  await verifyUser();
};

authorized();

const mountain = document.querySelector("#montagne");

mountain.addEventListener("click", () => {
  localStorage.setItem("category", "Montagne");
});

const seaside = document.querySelector("#bordDeMer");

seaside.addEventListener("click", () => {
  localStorage.setItem("category", "Bord de mer");
});
const countryside = document.querySelector("#campagne");

countryside.addEventListener("click", () => {
  localStorage.setItem("category", "Campagne");
});
const city = document.querySelector("#ville");

city.addEventListener("click", () => {
  localStorage.setItem("category", "Ville");
});
