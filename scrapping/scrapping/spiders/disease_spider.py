import scrapy
from scrapy.selector import Selector
from bs4 import BeautifulSoup
import re
import json
import os

class DiseaseSpider(scrapy.Spider):
    name = "disease"
    diseases = []

    def start_requests(self):
        disease_urls = read_from_json()
        for disease in disease_urls:
            yield scrapy.Request(url=disease["wikipediaURL"], callback=self.parse)
        print(len(self.diseases))
        f = open("../disease_overviews.json", "w")
        f.write(json.dumps(self.diseases, indent=4, separators=(", ", ": ")))

    def parse(self, response):
        page = response.url.split("/")[-2]
        heading = response.css('#firstHeading::text').get()
        body = response.css('#bodyContent p:not(.mw-empty-elt):nth-of-type(1n), #bodyContent p:not(.mw-empty-elt):nth-of-type(2n)').extract()
        #bodyContent p:first-of-type
        soup = BeautifulSoup(body[0])
        overview = soup.get_text().encode("utf-8")
        overview = re.sub(r'\[.+?\]', '', overview)
        if (len(body) > 1):
            soup = BeautifulSoup(body[1])
            paragraph2 = soup.get_text().encode("utf-8")
            paragraph2 = re.sub(r'\[.+?\]', '', paragraph2)
            overview += paragraph2
        self.diseases.append({"heading" : heading, "overview" : overview})
        #print("\n\nheading: " + heading + "\n\n")
        #print("\n\nbody: " + overview + "\n\n")

def read_from_json():
    file_name = '../diseases.json'
    f = open(file_name, 'r')
    return json.loads(f.read())
    


