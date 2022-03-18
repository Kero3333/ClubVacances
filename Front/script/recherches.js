const axios = require("axios");
const verifyUser = require("./modules/verifyUser");

const authorized = async () => {
  await verifyUser();
};

const displayLocations = (data) => {
  const season = data[0];

  const locations = document.querySelector(".locations");
  locations.innerHTML = ``;
  data.forEach((location, i) => {
    if (i > 0) {
      const ul = document.createElement("ul");
      ul.id = location.id;
      const price = location.attributes[season + "_season"];
      const { name, localisation, description, type } = location.attributes;
      console.log(location.id);
      const urlPicture = `http://localhost:1337${location.attributes.picture.data[0].attributes.formats.thumbnail.url}`;

      ul.innerHTML += `
      <img src="${urlPicture}" alt="photo"/>
      <li>${name}</li>
      <li>${localisation}</li>
      <li>${description}</li>
      <li>${type}</li>
      <li>${price} €</li>
      `;

      ul.addEventListener("click", () => {
        localStorage.setItem("season", season);
        localStorage.setItem(
          "picture",
          `http://localhost:1337${location.attributes.picture.data[0].attributes.url}`
        );
        localStorage.setItem("location", JSON.stringify(location));
        document.location.href = "./location.html";
      });
      locations.appendChild(ul);
    }
  });
};

const filteredByCategory = async () => {
  if (localStorage.getItem("category")) {
    let url = `http://localhost:3001/locations/search?category=${localStorage.getItem(
      "category"
    )}`;
    try {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      localStorage.removeItem("category");
      displayLocations(data);
    } catch (err) {
      console.log(err.message);
    }
  }
};

authorized();
filteredByCategory();

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const localisation = e.target.destination.value;
  const start = e.target.depart.value;
  const end = e.target.arrive.value;
  //   const adulte = e.target.adulte.value;
  //   const children = e.target.enfant.value;
  const bedroom = e.target.chambre.value;
  let url = "http://localhost:3001/locations/search?";
  const urlLenght = url.length;
  if (localisation) {
    url += `localisation=${localisation}`;
  }
  if (start && end) {
    if (urlLenght < url.length) {
      url += "&";
    }
    url += `date=${start},${end}`;
  }
  if (bedroom) {
    if (urlLenght < url.length) {
      url += "&";
    }
    url += `bedroom=${bedroom}`;
  }

  try {
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    displayLocations(data);
  } catch (err) {
    console.log(err.message);
  }
});
