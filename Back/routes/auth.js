const router = require("express").Router();
const axios = require("axios");

router.post("", async (req, res) => {
  try {
    const { data } = await axios.post(
      "http://127.0.0.1:1337/api/auth/local",
      req.body
    );
    res.send(data);
  } catch (err) {
    res.status(400).send("wrong email or password");
  }
});

module.exports = router;
