const express = require("express");
const router = express.Router();

const rosaenlgPug = require("rosaenlg");
module.exports = router;

router.post("/getRowText", (req, res) => {
  const { NLGData, info, data, stats, resourceName } = req.body;
  let text = "";
  let min, max, avg;
  let minArray = [],
    maxArray = [],
    unknownArray = [],
    zeroArray = [],
    other = {};

  if (NLGData.Race_and_Ethnicity[0] == "Yes") {
    let values = Object.values(data).map((each) => {
      return each.data;
    });
    min = Math.min.apply(null, values.filter(Boolean));
    max = Math.max.apply(null, values);
    avg = Math.round(values.reduce((a, b) => a + b) / values.length);
    //Math.min.apply(null, arr.filter(Boolean))
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key].data === null || data[key].data === undefined) {
          unknownArray.push(data[key].title);
        } else if (data[key].data === 0) {
          zeroArray.push(data[key].title);
        } else if (data[key].data === min) {
          minArray.push(data[key].title);
        } else if (data[key].data === max && min !== max) {
          maxArray.push(data[key].title);
        } else {
          other[key] = data[key];
        }
      }
    }
    text = rosaenlgPug.renderFile("./converter/createEthnicity.pug", {
      language: "en_US",
      NLG: NLGData,
      info: info,
      data: data,
      min: min,
      max: max,
      avg: avg,
      minArray: minArray,
      maxArray: maxArray,
      unknownArray: unknownArray,
      zeroArray: zeroArray,
      other: other,
      stats: stats,
      resourceName: resourceName,
      cache: true,
    });
  } else {
    text = rosaenlgPug.renderFile("./converter/createEthnicity.pug", {
      language: "en_US",
      NLG: NLGData,
      info: info,
      data: data,
      stats: stats,
      resourceName: resourceName,
      cache: true,
    });
  }

  res.status(200).send(text);
});

router.post("/getOverview", (req, res) => {
  const { NLGData, stats, resourceName, yearFormat } = req.body;
  let text = rosaenlgPug.renderFile("./converter/createStats.pug", {
    language: "en_US",
    NLG: NLGData,
    stats: stats,
    resourceName: resourceName,
    yearFormat: yearFormat,
    cache: true,
  });
  res.status(200).send(text);
});

router.post("/getEthnicStats", (req, res) => {
  const { NLGData, data, titles } = req.body;
  let values = Object.values(data).map((each) => {
    return Number(each);
  });
  let min=-1,
    max=-1,
    avg=-1,
    minArray = [],
    maxArray = [];
  if (values.length > 0) {
    min = Math.min.apply(null, values);
    max = Math.max.apply(null, values);
    avg = values.length > 0 && values.reduce((a, b) => a + b) / values.length;
    (minArray = []), (maxArray = []);
    for (let key in data) {
      if (Number(data[key]) === min) {
        minArray.push(titles[key.replace("avg_", "")]);
      } else if (Number(data[key]) === max) {
        maxArray.push(titles[key.replace("avg_", "")]);
      }
    }
  }
  let text = rosaenlgPug.renderFile(
    "./converter/createEthnicStats.pug",
    {
      language: "en_US",
      NLG: NLGData,
      avg: avg,
      min: min,
      max: max,
      minArray: minArray,
      maxArray: maxArray,
      cache: true,
    }
  );
  res.status(200).send(text);
});

router.post("/getRegionalStats", (req, res) => {
  const { NLGData, data, titles, filter } = req.body;
  let total = data["avg_total_est"];
  let regMin = data["min_total_est"];
  let regMax = data["max_total_est"];
  delete data["avg_total_est"]; delete data["min_total_est"]; delete data["max_total_est"];
  let values = Object.values(data).map((each) => {
    return Number(each);
  });
  let min=-1,
    max=-1,
    avg=-1,
    minArray = [],
    maxArray = [];
  if (values.length > 0) {
    min = Math.min.apply(null, values);
    max = Math.max.apply(null, values);
    avg = values.reduce((a, b) => a + b) / values.length;
    minArray = [],
      maxArray = [];
    for (let key in data) {
      if (Number(data[key]) === min) {
        minArray.push(titles[key.replace("avg_", "")]);
      } else if (Number(data[key]) === max) {
        maxArray.push(titles[key.replace("avg_", "")]);
      }
    }
  }

  let text = rosaenlgPug.renderFile(
    "./converter/createRegionalStats.pug",
    {
      language: "en_US",
      NLG: NLGData,
      avg: avg,
      min: min,
      max: max,
      regMin: regMin,
      regMax: regMax,
      minArray: minArray,
      maxArray: maxArray,
      total: total,
      cache: true,
      filter: filter,
    }
  );
  res.status(200).send(text);
});
