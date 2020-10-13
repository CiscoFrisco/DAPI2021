import scrapy
from scrapy.selector import Selector
from bs4 import BeautifulSoup
import re
import json
import os

class DiseaseSpider(scrapy.Spider):
    name = "disease"
    diseases = []
    disease_urls = []
    f = ''
    num = 0

    def start_requests(self):
        self.disease_urls = read_from_json()
        
        self.f = open("../disease_overviews.json", "w")
        self.f.write('[')#json.dumps(self.diseases, indent=4, separators=(", ", ": "))
        for disease in self.disease_urls:
            yield scrapy.Request(url=disease["wikipediaURL"], callback=self.parse)

    def parse(self, response):
        self.num+=1
        page = response.url
        heading = response.css('#firstHeading::text').get()
        body = response.css('#bodyContent p:not(.mw-empty-elt):nth-of-type(1n), #bodyContent p:not(.mw-empty-elt):nth-of-type(2n)').extract()
        soup = BeautifulSoup(body[0])
        overview = soup.get_text().encode("utf-8")
        overview = re.sub(r'\[.+?\]', '', overview)
        if (len(body) > 1):
            soup = BeautifulSoup(body[1])
            paragraph2 = soup.get_text().encode("utf-8")
            paragraph2 = re.sub(r'\[.+?\]', '', paragraph2)
            overview += paragraph2
        code = filter(lambda v: find_code(v, page),self.disease_urls)
        self.f.write(json.dumps({"id": code[0]["id"], "heading" : heading, "overview" : overview}, indent=4, separators=(", ", ": ")))
        if self.num < len(self.disease_urls):
            self.f.write(',\n')
        else:
            self.f.write(']')
        self.diseases.append({"id": code[0]["id"], "heading" : heading, "overview" : overview})

def read_from_json():
    file_name = '../diseases.json'
    f = open(file_name, 'r')
    return json.loads(f.read())

def find_code(variable, url):
    if(variable["wikipediaURL"] == url):
        return True
    return False
