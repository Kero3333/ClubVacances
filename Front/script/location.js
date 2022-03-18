const axios = require("axios");
const verifyUser = require("./modules/verifyUser");

const authorized = async () => {
  await verifyUser();
};

authorized();

const name1 = document.querySelector(".nomDuLieu");
const localisation = document.querySelector(".secteur");
const Description = document.querySelector(".description");
const surface = document.querySelector(".carre");
const price = document.querySelector(".prix");
const bedroom = document.querySelector(".chambre");
const bathroom = document.querySelector(".salleDeBain");
const equipment = document.querySelector(".equipements");
const category = document.querySelector(".categorie");
const type = document.querySelector(".type");
const img = document.querySelector(".imggrande");

const { attributes: location, id } = JSON.parse(
  localStorage.getItem("location")
);

const season = localStorage.getItem("season");

img.src = localStorage.getItem("picture");
name1.textContent = location.name;
localisation.textContent = location.localisation;
Description.textContent = location.description;
surface.textContent = `${location.area} m²`;
price.textContent = `${location[season + "_season"]} €`;
bedroom.textContent = location.bedroom;
bathroom.textContent = location.bathroom;
equipment.textContent = location.equipment;
category.textContent = location.category;
type.textContent = location.type;

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cook = document.querySelector("#chef").checked;
  const visit = document.querySelector("#visite").checked;
  const start_date = e.target.startDate.value;
  const end_date = e.target.endDate.value;
  const message = e.target.texteReserve.value;

  try {
    await axios.post(
      "http://127.0.0.1:3001/reservation",
      {
        start_date,
        end_date,
        cook,
        visit,
        message,
        location: id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.log(err.message);
  }
});
