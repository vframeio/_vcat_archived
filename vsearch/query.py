#!python

import sys
import json
import argparse
import cv2 as cv

from faiss_db.db import FaissSearch
from feature_extractor import FeatureExtractor

import faiss_db.config as config

parser = argparse.ArgumentParser()
parser.add_argument('--config', required=True)
parser.add_argument('--factory_type')
parser.add_argument('--limit', type=int, default=15)
parser.add_argument('--query', type=str, required=True)
opt = parser.parse_args()

recipe = config.load(opt.config)

dataset = recipe.dataset
factory_type = opt.factory_type or recipe.faiss.factory_type

fe = FeatureExtractor(config=recipe)
db = FaissSearch(recipe, factory_type)

img = cv.imread(opt.query)
query = fe.extract(img)
results = db.search(query, opt.limit)

print(json.dumps(results, indent=2))

