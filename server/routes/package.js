const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.post("/package", (req, res) => {
  const { id } = req.body;
  const base = "https://data.diversitydatakids.org/api/3/action/package_show";
  let myUrl = new URL(base);
  myUrl.searchParams.append("id", id);
  fetch(myUrl)
    .then((result) => {
      return result.json();
    })
    .then((json) => {
      res.status(200).send(json);
    })
    .catch((err) => {
      res.status(404).send({ success: false });
    });
});

module.exports = router;
