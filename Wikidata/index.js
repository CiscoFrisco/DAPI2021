const fetch = require("node-fetch");
const fs = require("fs");
const wdk = require("wikidata-sdk");
const diseases = require("../diseases.json");
const options = require("./options.json");
const data = require("./data.json");

const URL = "https://www.wikidata.org/w/api.php";

const SEP = "%7C";
const LANGUAGE = options.language;
const PROPS = [
  "labels" + SEP + "descriptions" + SEP + "claims",
  "labels" + SEP + "sitelinks",
];

var retrieveData = [];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const saveData = () => {
  data.push(...retrieveData);
  retrieveData = [];

  fs.writeFile("data.json", JSON.stringify(data), "utf8", function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("Data JSON file has been saved.");
  });
};

const fetchAllData = async () => {
  let counter = 0;

  for (var i = 0; i < diseases.length; i++) {
    let found = false;
    for (var j = 0; j < data.length; j++) {
      if (data[j].id == diseases[i].id) {
        found = true;
        break;
      }
    }

    if (!found) {
      await fetchWikiData(diseases[i].id, 0);
      counter++;

      if (counter % 5 === 0 && counter != 0) {
        saveData();
      }

      if (i != diseases.length - 1) {
        console.log("Waiting 5 seconds until next request!");
        await sleep(5000);
      } else {
        saveData();
      }
    }
  }
  console.log("Finished information retrieval");
};

const getURL = (IDs, propType) => {
  return (
    URL +
    "?action=wbgetentities&ids=" +
    IDs +
    "&format=json" +
    "&languages=" +
    LANGUAGE +
    "&props=" +
    PROPS[propType]
  );
};

const fetchWikiData = async (ID, propType) => {
  const URL = getURL(ID, propType);
  console.log(URL);
  const response = await fetch(URL);
  const myJSON = await response.json(); //extract JSON from the http response

  await parseJSON(myJSON);
};

// fetchWikiData(diseases[0], 0);
fetchAllData();
// getURL("Q12312", 1);

const parseJSON = async (response) => {
  let obj = new Object();

  obj.id = Object.keys(response.entities)[0];
  const entity = response.entities[obj.id];

  parseOptionQueries(entity, obj);

  for (let i = 0; i < options.properties.length; i++) {
    await getPropertyData(entity.claims, options.properties[i], obj);
    await sleep(Math.floor(Math.random() * 100));
  }

  retrieveData.push(obj);
};

const parseOptionQueries = (entity, obj) => {
  for (let i = 0; i < options.queries.length; i++) {
    const query = options.queries[i];
    if (query == "labels")
      obj["name"] = entity[options.queries[i]][LANGUAGE].value;
    else obj[query] = entity[options.queries[i]][LANGUAGE].value;
  }
};

const decodePropertyUrl = (sitelinks) => {
  if (sitelinks["enwiki"] !== undefined) {
    return (
      "https://en.wikipedia.org/wiki/" +
      encodeURI(sitelinks["enwiki"].title).replace(/%20/g, "_")
    );
  }

  return "none";
};

const getPropertyData = async (claims, property, obj) => {
  var prop = await requestProperty(claims, property.code);

  obj[property.name] = [];

  if (prop !== null) {
    Object.keys(prop.entities).map((key) =>
      obj[property.name].push({
        id: prop.entities[key].id,
        name: prop.entities[key].labels.en.value,
        url: decodePropertyUrl(prop.entities[key].sitelinks),
      })
    );
  }
};

const requestProperty = async (claims, key) => {
  if (claims.hasOwnProperty(key)) {
    var ids = "";

    for (let i = 0; i < claims[key].length; i++) {
      const obj = claims[key][i];
      ids +=
        obj.mainsnak.datavalue.value.id +
        (i == claims[key].length - 1 ? "" : SEP);
    }

    console.log("REQUEST: " + getURL(ids, 1));

    return await fetch(getURL(ids, 1))
      .then((response) => response.json())
      .catch((err) => console.log(err));
  }

  return null;
};
