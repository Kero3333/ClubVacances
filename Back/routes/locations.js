const router = require("express").Router();
const axios = require("axios");

const verifyToken = require("../middlewares/verifyToken");

router.use(verifyToken);

// permet de croiser les résultats de différent filtres
const keepDuplicat = (locations) => {
  // on récupère le nombre de filtre qui a été appliquer ([[resultatFiltre1],[resultFiltre2]])
  const filterNumber = locations.length;

  // on créer un tableau contenant l'ensemble des résultats et on le tri
  locations = locations.flat();
  locations = locations.sort((a, b) => {
    if (a.id > b.id) {
      return -1;
    }
    if (a.id <= b.id) {
      return 0;
    }
  });

  let numberDuplicat = 0;
  let results = [];
  for (let i = 1; i < locations.length; i++) {
    // on repère les doublons
    if (locations[i - 1] === locations[i]) {
      numberDuplicat += 1;
    } else {
      numberDuplicat = 0;
    }
    // si le nombre de doublons d'un élément est équivalent au nombre de filtre qui a été appliquer
    if (numberDuplicat + 1 === filterNumber) {
      //alors on le met dans le tableau results
      results.push(locations[i]);
      numberDuplicat = 0;
    }
  }
  return results;
};

router.get("", async (req, res) => {
  const options = {
    method: "get",
    url: "http://localhost:1337/api/locations",
    headers: {
      Authorization: req.headers.authorization,
      "Content-Type": "application/json",
    },
  };
  const { data: locations } = await axios(options);
  res.json(locations);
});

router.get("/search", async (req, res) => {
  console.log(req.query);
  let url = "http://localhost:1337/api/locations?&populate=picture";

  const { localisation } = req.query;
  if (localisation) {
    url += `filters[localisation][$eq]=${localisation}`;
  }

  const { bedroom } = req.query;
  if (bedroom) {
    url += `&filters[bedroom][$gte]=${bedroom}`;
  }

  let { equipment } = req.query;
  if (equipment) {
    if (!equipment.includes(",")) {
      url += `&filters[equipment][$contains]=${equipment}`;
    } else {
      equipment = equipment.split(",");
    }
  }
  let { category } = req.query;

  if (category) {
    if (!category.includes(",")) {
      url += `&filters[category][$contains]=${category}`;
    } else {
      category = category.split(",");
    }
  }
  let { type } = req.query;

  if (type) {
    if (!type.includes(",")) {
      url += `&filters[type][$contains]=${type}`;
    } else {
      type = type.split(",");
    }
  }

  // on détermine les  dates des périodes des différentes saisons
  const seasons = {
    medium: [],
    high: ["07", "08", "12"],
  };

  const {
    data: { records: vacances },
  } = await axios.get(
    "https://data.education.gouv.fr/api/records/1.0/search/?dataset=fr-en-calendrier-scolaire&q=&rows=20&facet=description&facet=population&facet=start_date&facet=end_date&facet=location&facet=zones&facet=annee_scolaire&refine.annee_scolaire=2021-2022"
  );

  const takeIntervalleDate = (vacances, nom) => {
    const listeVac = vacances.filter(
      (vacance) => vacance.fields.description === nom
    );
    listeVac.sort((a, b) => {
      if (a.fields.start_date > b.fields.start_date) {
        return -1;
      }
      return 0;
    });
    const intervalle = [];
    intervalle.push(
      listeVac[listeVac.length - 1].fields.start_date.split("T")[0]
    );
    intervalle.push(listeVac[0].fields.end_date.split("T")[0]);
    console.log(seasons);
    return intervalle;
  };

  seasons.medium.push(takeIntervalleDate(vacances, "Vacances d'Hiver"));
  seasons.medium.push(takeIntervalleDate(vacances, "Vacances de Printemps"));
  seasons.medium.push(takeIntervalleDate(vacances, "Vacances de la Toussaint"));

  let season = "medium";
  let { date } = req.query;
  if (date) {
    date = date.split(",");

    const start_date = date[0];

    const month = date[0].split("-")[1];

    seasons.medium.forEach((intervalle) => {
      if (start_date <= intervalle[1] && start_date >= intervalle[0]) {
        return (season = "medium");
      }
    });

    seasons.high.forEach((months) => {
      if (month === months) {
        return (season = "high");
      }
    });

    if (season === "") {
      season = "low";
    }
  }
  console.log(url);

  // envoie de la requête à strapi
  try {
    const options = {
      method: "get",
      url: url,
      headers: {
        Authorization: req.headers.authorization,
        "Content-Type": "application/json",
      },
    };

    const {
      data: { data: locations },
    } = await axios(options);
    console.log(locations);

    // filtrer
    let locationsFiltered = [];

    // filtre des equipements
    let locationsEquipment = [];
    if (Array.isArray(equipment)) {
      equipment.forEach((el) => {
        locationsEquipment.push(
          locations.filter((location) =>
            location.attributes.equipment.includes(el)
          )
        );
      });
      locationsFiltered.push(keepDuplicat(locationsEquipment));
    }

    // filtre des categories
    let locationsCategory = [];
    if (Array.isArray(category)) {
      category.forEach((el) => {
        locationsCategory.push(
          locations.filter((location) => location.attributes.category === el)
        );
      });
      locationsFiltered.push(locationsCategory.flat(2));
    }

    // filtre des types d'habitations
    let locationsType = [];
    if (Array.isArray(type)) {
      type.forEach((el) => {
        locationsType.push(
          locations.filter((location) => location.attributes.type === el)
        );
      });
      locationsFiltered.push(locationsType.flat(2));
    }

    // si l'un des filtres du dessus a été appliquer
    if (locationsFiltered.length !== 0) {
      // on croise les résultats des différents filtres
      const results = keepDuplicat(locationsFiltered);
      // on ajoute dans la réponse la période de la saison
      results.unshift(season);
      return res.json(results);
    }

    locations.unshift(season);
    res.json(locations);
  } catch (err) {
    console.log(err);
    if (err.message === "Request failed with status code 500") {
      res.status(500).send("Request failed with status code 500");
    }
  }
});

module.exports = router;
