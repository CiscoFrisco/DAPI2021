const fetch = require("node-fetch");
const wdk = require("wikidata-sdk");
const diseases = require("./diseases.json");
const options = require("./options.json");

const URL = "https://www.wikidata.org/w/api.php";

const SEP = "%7C";
const LANGUAGES = options.languages.join(SEP);
const PROPS = ["labels" + SEP + "descriptions" + SEP + "claims", "labels"];

var result = [];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const fetchAllData = async () => {
  for (var i = 0; i < diseases.length; i++) {
    await fetchWikiData(diseases[i], 0);
    if (i != diseases.length - 1) {
      console.log("Waiting 6 seconds until next request!");
      await sleep(6000);
    }
  }

  console.log(result);
};

const getURL = (IDs, propType) => {
  return (
    URL +
    "?action=wbgetentities&ids=" +
    IDs +
    "&format=json" +
    "&languages=" +
    LANGUAGES +
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

const parseJSON = async (response) => {
  let obj = new Object();

  obj.id = Object.keys(response.entities)[0];
  const entity = response.entities[obj.id];

  parseOptionQueries(entity, obj);

  for (let i = 0; i < options.properties.length; i++) {
    await getPropertyData(entity.claims, options.properties[i], obj);
    await sleep(Math.floor(Math.random() * 100));
  }

  result.push(obj);
};

const parseOptionQueries = (entity, obj) => {
  for (let i = 0; i < options.queries.length; i++) {
    const query = options.queries[i];
    obj[query] = entity[options.queries[i]];
  }
};

const getPropertyData = async (claims, property, obj) => {
  try {
    var prop = await requestProperty(claims, property.code);
  } catch (err) {
    console.log(err);
  }

  obj[property.name] = [];

  Object.keys(prop.entities).map((key) =>
    obj[property.name].push({
      id: prop.entities[key].id,
      labels: prop.entities[key].labels,
    })
  );
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
};

const fetchTest = () => {
  const ids = [
    "Q30141616",
    "Q30141302",
    "Q30141343",
    "Q30141359",
    "Q30141517",
    "Q30141399",
    "Q30141432",
    "Q30141385",
    "Q30141414",
    "Q30141588",
    "Q83030",
  ];

  const url = wdk.getEntities({
    ids: ids,
    languages: ["en", "fr"],
    format: "json",
    props: ["info", "claims"],
    redirections: true, // defaults to true
  });

  console.log(url);
};

// fetchTest();
