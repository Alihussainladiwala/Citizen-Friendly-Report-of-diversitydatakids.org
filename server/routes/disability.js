const express = require("express");
const app = express();
const router = express.Router();
const fetch = require("node-fetch");

const rosaenlgPug = require("rosaenlg");

router.get("/nationDisabilityText/:ethnicity", (req, res) => {
  const result = fetch(
    "https://data.diversitydatakids.org/api/3/action/datastore_search?resource_id=c3be7a68-8713-4700-9a64-0e9a7ccb013c&limit=5"
  )
    .then((result) => {
      // console.log(result);
      return result.json();
    })
    .then((json) => {
      let res1 = "";
      //   console.log(json);
      if (req.params.ethnicity === "black") {
        res1 = rosaenlgPug.renderFile("./routes/disability.pug", {
          language: "en_US",
          ethnicity: "Asian",
        });
        console.log(res1);
      }
      let asians = [];
      if (req.params.ethnicity === "asian") {
        // console.log(res1);

        for (let i = 0; i < json.result.records.length; i++) {
          let asianObj = {
            ethnicity: "Asian",
            year: json.result.records[i].year,
            percent: json.result.records[i].asian_est,
          };
          asians.push(asianObj);
        }
        console.log(asians);
      }

      res1 = rosaenlgPug.renderFile("./routes/disability.pug", {
        language: "en_US",
        ethnicity: asians,
      });

      let ans = res1.split("</p><p>");
      ans[0] = ans[0].slice(3);
      ans[json.result.records.length - 1] = ans[
        json.result.records.length - 1
      ].substring(0, ans[json.result.records.length - 1].length - 4); //not sure of a better way

      //   res.status(200).json({ text: json.result.records });
      res.status(200).json({ ans });
    });
});

router.get("/nationDisabilityChart/:ethnicity", (req, res) => {
  const result = fetch(
    "https://data.diversitydatakids.org/api/3/action/datastore_search?resource_id=c3be7a68-8713-4700-9a64-0e9a7ccb013c&limit=5"
  )
    .then((result) => {
      // console.log(result);
      return result.json();
    })
    .then((json) => {
      console.log(json);
      let asians = [];
      if (req.params.ethnicity === "asian") {
        for (let i = 0; i < json.result.records.length; i++) {
          let asianObj = {
            ethnicity: "Asian",
            year: json.result.records[i].year,
            percent: json.result.records[i].asian_est,
          };
          asians.push(asianObj);
        }
        console.log(asians);

        res.status(200).json(asians);
      }
    });
});

module.exports = router;
