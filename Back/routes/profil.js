const router = require("express").Router();
const axios = require("axios");

const verifyToken = require("../middlewares/verifyToken");

router.use(verifyToken);

router.post("", async (req, res) => {
  const { firstname, lastname, email } = req.body;
  try {
    const {
      data: { id },
    } = await axios.get("http://localhost:1337/api/users/me", {
      headers: {
        Authorization: req.headers.authorization,
        "Content-Type": "application/json",
      },
    });
    try {
      await axios.put(
        `http://localhost:1337/api/users/${id}`,
        { firstname, lastname, email },
        {
          headers: {
            Authorization: req.headers.authorization,
            "Content-Type": "application/json",
          },
        }
      );
      res.send("ok");
    } catch (err) {
      res.status(400).send(err.message);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
