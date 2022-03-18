const axios = require("axios");

// on vérifie l'identité de l'utilisateur

module.exports = async () => {
  let token = localStorage.getItem("token");
  if (!token) {
    return (document.location.href = "http://localhost:1234/");
  }
  try {
    await axios.get("http://localhost:1337/api/users/me", {
      headers: {
        Authorization: req.headers.authorization,
        "Content-Type": "application/json",
      },
    });
    next();
  } catch (err) {
    res.status(401).send(err.message);
    document.location.href = "http://localhost:1234/";
  }
};
