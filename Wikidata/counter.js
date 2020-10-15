const data = require("./data.json");

var diseasesCount = data.length;

var causesList = [];
var symptomsList = [];
var specialitiesList = [];
var drugsList = [];
var treatmentsList = [];

var causesAvgPerDisease = 0;
var symptomsAvgPerDisease = 0;
var specialitiesAvgPerDisease = 0;
var drugsAvgPerDisease = 0;
var treatmentsAvgPerDisease = 0;

console.log("Number of diseases: " + diseasesCount);

for (var i = 0; i < diseasesCount; i++) {
  for (var j = 0; j < data[i]["Causes"].length; j++) {
    if (!causesList.includes(data[i]["Causes"][j].id))
      causesList.push(data[i]["Causes"][j].id);
  }

  for (var j = 0; j < data[i]["Symptoms"].length; j++) {
    if (!symptomsList.includes(data[i]["Symptoms"][j].id))
      symptomsList.push(data[i]["Symptoms"][j].id);
  }

  for (var j = 0; j < data[i]["Specialty"].length; j++) {
    if (!specialitiesList.includes(data[i]["Specialty"][j].id))
      specialitiesList.push(data[i]["Specialty"][j].id);
  }

  for (var j = 0; j < data[i]["Drugs"].length; j++) {
    if (!drugsList.includes(data[i]["Drugs"][j].id))
      drugsList.push(data[i]["Drugs"][j].id);
  }

  for (var j = 0; j < data[i]["Treatments"].length; j++) {
    if (!treatmentsList.includes(data[i]["Treatments"][j].id))
      treatmentsList.push(data[i]["Treatments"][j].id);
  }

  causesAvgPerDisease += data[i]["Causes"].length;
  symptomsAvgPerDisease += data[i]["Symptoms"].length;
  specialitiesAvgPerDisease += data[i]["Specialty"].length;
  drugsAvgPerDisease += data[i]["Drugs"].length;
  treatmentsAvgPerDisease += data[i]["Treatments"].length;
}

console.log("Causes " + causesList.length);
console.log("Symptoms " + symptomsList.length);
console.log("Specialties " + specialitiesList.length);
console.log("Drugs " + drugsList.length);
console.log("Treatments " + treatmentsList.length);

console.log(
  "Causes Avg " +
    causesAvgPerDisease / diseasesCount +
    "\nSymptoms Avg " +
    symptomsAvgPerDisease / diseasesCount +
    "\nSpecialties Avg " +
    specialitiesAvgPerDisease / diseasesCount +
    "\nDrugs Avg " +
    drugsAvgPerDisease / diseasesCount +
    "\nTreatments Avg " +
    treatmentsAvgPerDisease / diseasesCount
);
