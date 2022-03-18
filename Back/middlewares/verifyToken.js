const axios = require("axios");

const verifyToken = async (req, res, next) => {
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
  }
};

module.exports = verifyToken;
