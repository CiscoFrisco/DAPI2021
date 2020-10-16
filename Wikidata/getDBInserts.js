const fs = require("fs");
const data = require("./data.json");

var causesList = [];
var symptomsList = [];
var specialitiesList = [];
var drugsList = [];
var treatmentsList = [];

const contains = (list, id) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) return true;
  }

  return false;
};

for (let i = 0; i < data.length; i++) {
  for (let j = 0; j < data[i]["Causes"].length; j++) {
    if (!contains(causesList, data[i]["Causes"][j].id)) {
      causesList.push(data[i]["Causes"][j]);
    }
  }
  for (let j = 0; j < data[i]["Symptoms"].length; j++) {
    if (!contains(symptomsList, data[i]["Symptoms"][j].id)) {
      symptomsList.push(data[i]["Symptoms"][j]);
    }
  }
  for (let j = 0; j < data[i]["Specialty"].length; j++) {
    if (!contains(specialitiesList, data[i]["Specialty"][j].id)) {
      specialitiesList.push(data[i]["Specialty"][j]);
    }
  }
  for (let j = 0; j < data[i]["Drugs"].length; j++) {
    if (!contains(drugsList, data[i]["Drugs"][j].id)) {
      drugsList.push(data[i]["Drugs"][j]);
    }
  }
  for (let j = 0; j < data[i]["Treatments"].length; j++) {
    if (!contains(treatmentsList, data[i]["Treatments"][j].id)) {
      treatmentsList.push(data[i]["Treatments"][j]);
    }
  }
}

console.log("Causes " + causesList.length);
console.log("Symptoms " + symptomsList.length);
console.log("Specialties " + specialitiesList.length);
console.log("Drugs " + drugsList.length);
console.log("Treatments " + treatmentsList.length);

const getInsertValues = (name) => {
  return "INSERT INTO dbo." + name + "\n([Code], [Name], [Overview])\nVALUES\n";
};

const addToString = (list) => {
  let ret = "";
  for (let i = 0; i < list.length; i++) {
    ret +=
      "( N'" +
      list[i].id +
      "', N'" +
      list[i].name.replace(/'/g, "") +
      "', N'')";
    if (i !== list.length - 1) {
      ret += ",\n";
    } else {
      ret += "\nGO";
    }
  }

  return ret;
};

var causesSQL = getInsertValues("Cause") + addToString(causesList);
var symptomsSQL = getInsertValues("Symptom") + addToString(symptomsList);
var specialitySQL =
  getInsertValues("Speciality") + addToString(specialitiesList);
var drugsSQL = getInsertValues("Drug") + addToString(drugsList);
var treatmentSQL = getInsertValues("Treatment") + addToString(treatmentsList);

const saveToFile = (name, str) => {
  fs.writeFile("./db/" + name + ".sql", str, "utf8", function (err) {
    if (err) {
      console.log("An error occured while writing to the sql file");
      return console.log(err);
    }
  });
};

saveToFile("causes", causesSQL);
saveToFile("symptoms", symptomsSQL);
saveToFile("specialities", specialitySQL);
saveToFile("drugs", drugsSQL);
saveToFile("treatments", treatmentSQL);

console.log("Data SQL file has been saved.");
