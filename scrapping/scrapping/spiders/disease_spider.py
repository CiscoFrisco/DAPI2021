import scrapy
from scrapy.selector import Selector
from bs4 import BeautifulSoup
import re
import json
import os
import unicodedata

class DiseaseSpider(scrapy.Spider):
    name = "disease"
    disease_urls = []
    f = ''
    sql_file = ''
    num = 0

    def start_requests(self):
        self.disease_urls = read_from_json()
        
        self.f = open("../disease_overviews.json", "w")
        self.sql_file = open("disease_overviews.sql", "w")
        self.f.write('[')
        for disease in self.disease_urls:
            yield scrapy.Request(url=disease["wikipediaURL"], callback=self.parse)

    def parse(self, response):
        self.num+=1
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
        code = filter(lambda v: find_code(v, page),self.disease_urls)
        overview = re.sub(r'\'', '\'\'', overview)
        self.f.write(json.dumps({"id": code[0]["id"], "heading" : heading, "overview" : overview}, indent=4, separators=(", ", ": ")))
        sql_statement = 'UPDATE disease SET overview = \'' + overview + '\' WHERE id = \'' + code[0]["id"] + '\';\n'
        self.sql_file.write(sql_statement)
        if self.num < len(self.disease_urls):
            self.f.write(',\n')
        else:
            self.f.write(']')

def read_from_json():
    file_name = '../diseases.json'
    f = open(file_name, 'r')
    return json.loads(f.read())

def find_code(variable, url):
    if(variable["wikipediaURL"] == url):
        return True
    return False

def find_id(variable, id):
    if(variable["id"] == id):
        return True
    return False