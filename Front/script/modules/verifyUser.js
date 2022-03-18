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
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.log("ici2");

    document.location.href = "http://localhost:1234/";
  }
};
