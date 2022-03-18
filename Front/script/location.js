const axios = require("axios");

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
surface.textContent = location.area;
price.textContent = `${location[season + "_season"]} €`;
bedroom.textContent = location.bedroom;
bathroom.textContent = location.bathroom;
equipment.textContent = location.equipment;
category.textContent = location.category;
type.textContent = location.type;

console.log(id);

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cook = e.target.chef.value;
  const visit = e.target.visite.value;
  const start_date = e.target.startDate.value;
  const end_date = e.target.endDate.value;
  const message = e.target.texteReserve.value;

  console.log(document.querySelector("#chef").checked);

  //   try {
  //     await axios.post("http://127.0.0.1:3001/reservation", {
  //       start_date,
  //       end_date,
  //       cook,
  //       visit,
  //       message,
  //       id,
  //     });
  //   } catch (err) {
  //     console.log(err.message);
  //   }
});
