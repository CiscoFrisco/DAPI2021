import scrapy
from scrapy.selector import Selector
from bs4 import BeautifulSoup
import re
import json
import os

class DiseaseSpider(scrapy.Spider):
    name = "disease"

    def start_requests(self):
        read_from_json()
        urls = [
            'https://en.wikipedia.org/wiki/Alzheimer%27s_disease',
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        page = response.url.split("/")[-2]
        heading = response.css('#firstHeading::text').get()
        body = response.css('#mw-content-text table + p, #mw-content-text table + p + p').extract()
        soup = BeautifulSoup(body[0])
        overview = soup.get_text().encode("utf-8")
        overview = re.sub(r'\[.+?\]', '', overview)
        soup = BeautifulSoup(body[1])
        paragraph2 = soup.get_text().encode("utf-8")
        paragraph2 = re.sub(r'\[.+?\]', '', paragraph2)
        overview += paragraph2
        print("\n\nheading: " + heading + "\n\n")
        print("\n\nbody: " + overview + "\n\n")

def read_from_json():
    file_name = '../Wikidata/diseases.json'
    f = open(file_name, "r")
    print(f.read())
