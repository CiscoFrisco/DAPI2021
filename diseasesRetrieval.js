const fetch = require("node-fetch");
const fs = require("fs");

const data = [];

const URL =
  "https://query.wikidata.org/sparql?query=SELECT%20DISTINCT%20%3Fid%20%3Farticle%20WHERE%20%7B%0A%20%20%3Fid%20(wdt%3AP31%3F%2Fwdt%3AP279*)%20wd%3AQ12136.%0A%20%20%3Farticle%20schema%3Aabout%20%3Fid%20.%0A%20%20%3Farticle%20schema%3AisPartOf%20%3Chttps%3A%2F%2Fen.wikipedia.org%2F%3E.%0A%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%0A%20%20%20%20bd%3AserviceParam%20wikibase%3Alanguage%20%22en%22%0A%20%20%7D%0A%20%20%0A%7D%20ORDER%20BY%20%3Fid&format=json";

const fetchDiseases = async () => {
  console.log("Request made. This may take a few seconds...");

  const response = await fetch(URL).catch((err) =>
    console.log("Failed to retrieve diseases list")
  );
  const result = await response.json();

  console.log(result.results.bindings.length);

  result.results.bindings.forEach((disease) => {
    const parts = disease.id.value.split(/[\s\/]+/);
    data.push({
      id: parts[parts.length - 1],
      wikipediaURL: disease.article.value,
    });
  });

  fs.writeFile("diseases.json", JSON.stringify(data), "utf8", function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("JSON file has been saved.");
  });
};

fetchDiseases();
