import scrapy
from scrapy.selector import Selector
from bs4 import BeautifulSoup
import re
import json
import os
from functools import partial
import unicodedata

class DataSpider(scrapy.Spider):
    name = "data"
    f = ''
    sql_file = ''

    def start_requests(self):
        diseases = read_from_json()
        self.sql_file = open("data_overviews.sql", "w")
        self.f = open("../data_overviews.json", "w")
        for disease in diseases:
            for treatment in disease["Treatments"]:
                if (treatment["url"] != "none"):
                    object_treatment = json.dumps({"id": treatment["id"], "type": "treatment"})
                    yield scrapy.Request(url=treatment["url"], callback=partial(self.parse, object_treatment))
            for symptom in disease["Symptoms"]:
                if (symptom["url"] != "none"):
                    object_symptom = json.dumps({"id": symptom["id"], "type": "symptom"})
                    yield scrapy.Request(url=symptom["url"], callback=partial(self.parse, object_symptom))
            for cause in disease["Causes"]:
                if (cause["url"] != "none"):
                    object_cause = json.dumps({"id": cause["id"], "type": "cause"})
                    yield scrapy.Request(url=cause["url"], callback=partial(self.parse, object_cause))
            for drug in disease["Drugs"]:
                if (drug["url"] != "none"):
                    object_drug = json.dumps({"id": drug["id"], "type": "drug"})
                    yield scrapy.Request(url=drug["url"], callback=partial(self.parse, object_drug))
            for specialty in disease["Specialty"]:
                if (specialty["url"] != "none"):
                    object_specialty = json.dumps({"id": specialty["id"], "type": "specialty"})
                    yield scrapy.Request(url=specialty["url"], callback=partial(self.parse, object_specialty))

    def parse(self, object_data, response):
        object_data = json.loads(object_data)
        page = response.url
        heading = response.css('#firstHeading::text').get()
        body = response.css('#bodyContent p:not(.mw-empty-elt):nth-of-type(1n), #bodyContent p:not(.mw-empty-elt):nth-of-type(2n)').extract()
        soup = BeautifulSoup(body[0])
        overview = unicodedata.normalize("NFKD", soup.get_text(strip=True)).encode('ASCII', 'ignore')
        overview = re.sub(r'\[.+?\]', '', overview)
        if (len(body) > 1):
            soup = BeautifulSoup(body[1])
            paragraph2 = unicodedata.normalize("NFKD", soup.get_text(strip=True)).encode('ASCII', 'ignore')
            paragraph2 = re.sub(r'\[.+?\]', '', paragraph2)
            overview += paragraph2
        self.f.write(json.dumps({"id" : object_data["id"], "type" : object_data["type"], "heading" : heading, "overview" : overview}, indent=4, separators=(", ", ": ")))
        overview = re.sub(r'\'', '\'\'', overview)
        sql_statement = 'UPDATE ' + object_data["type"] + ' SET overview = \'' + overview + '\' WHERE id = \'' + object_data["id"] + '\';\n'
        self.sql_file.write(sql_statement)

def read_from_json():
    file_name = '../Wikidata/data.json'
    f = open(file_name, 'r')
    return json.loads(f.read())

