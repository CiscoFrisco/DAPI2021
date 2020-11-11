import json

def find_element(elem_file, element):
    for elem in elem_file:
        if (elem["id"] == element):
            return elem["name_t"]
    return ""

def add_disease_elem(elem, disease, elem_file):
    for element in elem_file:
        if (element["id"] == elem):
            if ("disease" in element):
                element["disease"].append(disease)
            else:
                element["disease"] = [disease]
            break

def remove_ids(file):
    for elem in file:
        if ("id" in elem):
            elem.pop("id", None)

file_name = './Disease.json'
f = open(file_name, 'r')
diseases = json.loads(f.read())

file_name2 = './Drug.json'
f2 = open(file_name2, 'r')
drug_file = json.loads(f2.read())

file_name3 = './Cause.json'
f3 = open(file_name3, 'r')
cause_file = json.loads(f3.read())

file_name4 = './Speciality.json'
f4 = open(file_name4, 'r')
specialty_file = json.loads(f4.read())

file_name5 = './Symptom.json'
f5 = open(file_name5, 'r')
symptom_file = json.loads(f5.read())

file_name6 = './Treatment.json'
f6 = open(file_name6, 'r')
treatment_file = json.loads(f6.read())

for disease in diseases:
    disease.pop("disease_id", None)
    if ("drug" in disease):
        for i in range(0, len(disease["drug"])):
            disease["drug"][i] = find_element(drug_file, disease["drug"][i])
    if ("cause" in disease):
        for i in range(0, len(disease["cause"])):
            disease["cause"][i] = find_element(cause_file, disease["cause"][i])
    if ("specialty" in disease):
        for i in range(0, len(disease["specialty"])):
            disease["specialty"][i] = find_element(specialty_file, disease["specialty"][i])
    if ("symptom" in disease):
        for i in range(0, len(disease["symptom"])):
            symptom_id = disease["symptom"][i]
            disease["symptom"][i] = find_element(symptom_file, symptom_id)
            add_disease_elem(symptom_id, disease["disease_name"], symptom_file)
    if ("treatment" in disease):
        for i in range(0, len(disease["treatment"])):
            treatment_id = disease["treatment"][i]
            disease["treatment"][i] = find_element(treatment_file, treatment_id)
            add_disease_elem(treatment_id, disease["disease_name"], treatment_file)

file_name_write = './Disease_New.json'
f_write = open(file_name_write, 'w')
f_write.write(json.dumps(diseases))

remove_ids(symptom_file)
file_name_write = './Symptom_New.json'
f_write = open(file_name_write, 'w')
f_write.write(json.dumps(symptom_file))

remove_ids(treatment_file)
file_name_write = './Treatment_New.json'
f_write = open(file_name_write, 'w')
f_write.write(json.dumps(treatment_file))