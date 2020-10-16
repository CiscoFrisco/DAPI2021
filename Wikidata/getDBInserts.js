const fs = require("fs");
const data = require("./data.json");

var causesList = [];
var symptomsList = [];
var specialitiesList = [];
var drugsList = [];
var treatmentsList = [];

var diseasesSQL =
  "INSERT INTO dbo.Disease\n([Code], [Name], [Description], [Overview])\nVALUES\n";
var canLeadTo = "INSERT INTO dbo.CanLeadTo\n([Code1], [Code2])\nVALUES\n";
var develops = "INSERT INTO dbo.Develop\n([Code1], [Code2])\nVALUES\n";
var isCuredBy = "INSERT INTO dbo.IsCuredBy\n([Code1], [Code2])\nVALUES\n";
var isTreatedBy = "INSERT INTO dbo.IsTreatedBy\n([Code1], [Code2])\nVALUES\n";
var belongsTo = "INSERT INTO dbo.BelongsTo\n([Code1], [Code2])\nVALUES\n";

const contains = (list, id) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) return true;
  }

  return false;
};

const insertAssociation = (id1, id2) => {
  return "( N'" + id1 + "', N'" + id2 + "'),\n";
};

for (let i = 0; i < data.length; i++) {
  diseasesSQL +=
    "( N'" +
    data[i].id +
    "', N'" +
    data[i].name.replace(/'/g, "") +
    "', N'" +
    (data[i].descriptions !== undefined
      ? data[i].descriptions.replace(/'/g, "")
      : "") +
    "', N'')";

  for (let j = 0; j < data[i]["Causes"].length; j++) {
    if (!contains(causesList, data[i]["Causes"][j].id)) {
      causesList.push(data[i]["Causes"][j]);
    }

    canLeadTo += insertAssociation(data[i].id, data[i]["Causes"][j].id);
  }
  for (let j = 0; j < data[i]["Symptoms"].length; j++) {
    if (!contains(symptomsList, data[i]["Symptoms"][j].id)) {
      symptomsList.push(data[i]["Symptoms"][j]);
    }

    develops += insertAssociation(data[i].id, data[i]["Symptoms"][j].id);
  }
  for (let j = 0; j < data[i]["Specialty"].length; j++) {
    if (!contains(specialitiesList, data[i]["Specialty"][j].id)) {
      specialitiesList.push(data[i]["Specialty"][j]);
    }

    belongsTo += insertAssociation(data[i].id, data[i]["Specialty"][j].id);
  }
  for (let j = 0; j < data[i]["Drugs"].length; j++) {
    if (!contains(drugsList, data[i]["Drugs"][j].id)) {
      drugsList.push(data[i]["Drugs"][j]);
    }

    isCuredBy += insertAssociation(data[i].id, data[i]["Drugs"][j].id);
  }
  for (let j = 0; j < data[i]["Treatments"].length; j++) {
    if (!contains(treatmentsList, data[i]["Treatments"][j].id)) {
      treatmentsList.push(data[i]["Treatments"][j]);
    }

    isTreatedBy += insertAssociation(data[i].id, data[i]["Treatments"][j].id);
  }

  if (i !== data.length - 1) {
    diseasesSQL += ",\n";
  } else {
    diseasesSQL += "\nGO";

    canLeadTo += "GO";
    develops += "GO";
    belongsTo += "GO";
    isCuredBy += "GO";
    isTreatedBy += "GO";
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
saveToFile("diseases", diseasesSQL);
saveToFile("canLeadTo", canLeadTo);
saveToFile("develops", develops);
saveToFile("belongsTo", belongsTo);
saveToFile("isCuredBy", isCuredBy);
saveToFile("isTreatedBy", isTreatedBy);

console.log("Data SQL file has been saved.");
