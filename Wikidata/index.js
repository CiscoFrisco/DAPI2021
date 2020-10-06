const fetch = require("node-fetch");
const diseases = require("./diseases.json");
const options = require("./options.json");

const URL = "https://www.wikidata.org/w/api.php";

var result = [];

const parseJSON = (response) => {
  let obj = new Object();

  obj.id = Object.keys(response.entities)[0];

  const entity = response.entities[obj.id];

  getOptionQueries(entity, obj);

  for (let i = 0; i < options.properties.length; i++) {
    console.log(options.properties[i]);
    getClaim(entity.claims, options.properties[i].code)
      .then((result) => parseResponse(result, obj, options.properties[i].name))
      .catch((err) => console.log(err));
    // break;
  }

  console.log(obj);
};

const parseResponse = (result, obj, child) => {
  obj[child] = new Object();
  const query = options.queries[0];
  console.log(result);

  for (let j = 0; j < options.languages.length; j++) {
    var opt = [];

    for (let i = 0; i < result.length; i++) {
      const labels =
        result[i].entities[Object.keys(result[i].entities)[0]][query];

      opt.push(...[labels[options.languages[j].code]]);
    }

    obj[child][options.languages[j].name] = opt;
  }

  // console.log(obj);
};

const getOptionQueries = (entity, obj) => {
  for (let i = 0; i < options.queries.length; i++) {
    const query = options.queries[i];
    var opt = [];
    for (let j = 0; j < options.languages.length; j++) {
      opt.push(...[entity[query][options.languages[j].code]]);
    }
    obj[query] = opt;
  }
};

const getClaim = async (claims, key) => {
  if (claims.hasOwnProperty(key)) {
    console.log(claims[key].length);
    let promiseArray = [];
    for (let i = 0; i < claims[key].length; i++) {
      const obj = claims[key][i];
      const id = obj.mainsnak.datavalue.value.id;
      promiseArray.push(
        fetch(getURL(id))
          .then((response) => response.json())
          .catch((err) => console.log(err))
      );
    }
    return await Promise.all(promiseArray);
  }
};

const getURL = (ID) => {
  return URL + "?action=wbgetentities&ids=" + ID + "&format=json";
};

const fetchWikiData = async (ID) => {
  const response = await fetch(getURL(ID));
  const myJSON = await response.json(); //extract JSON from the http response
  parseJSON(myJSON);
};

// for (var i = 0; i < diseases.length; i++) {
//   fetchWikiData(diseases[i]);
// }

fetchWikiData(diseases[0]);
