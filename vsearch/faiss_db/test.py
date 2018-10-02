#!python

import sys
import json
import argparse
import numpy as np
import random
import os
from os import path

import config
from db import FaissSearch

parser = argparse.ArgumentParser()
parser.add_argument('--config', required=True)
parser.add_argument('--limit', type=int, default=10)
parser.add_argument('--test_count', type=int, default=10)
opt = parser.parse_args()

recipe = config.load(opt.config)

dataset = recipe.dataset

base_dir = path.join(path.dirname(path.abspath(__file__)), "..")
data_dir = path.join(base_dir, "datasets", dataset, "data")
pkl_fn = "index.pkl"
index_dir = path.join(base_dir, "datasets", dataset, "index")
html_dir = path.join(base_dir, "datasets", dataset, "web")
html_fn = path.join(base_dir, "datasets", dataset, "web", "index.html")

data = config.load_pickle(data_dir, pkl_fn)

os.makedirs(html_dir, exist_ok=True)
with open(html_fn, "w") as f:
  f.write("""
    <style>
    section { margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #ddd; }
    .result div { display: inline-block; }
    .result img { width: 200px; max-height: 90px; }
    .result span { display: block; }
    </style>
    """)

  # TODO: note if our test data is actually verified
  verified = 1

  for i in range(opt.test_count):
    key = random.choice(list(data['videos'].keys()))
    frame = random.choice(list(data['videos'][key].keys()))
    vec = data['videos'][key][frame]

    f.write('<section>\n')
    f.write('<h2>test #{}: video {}, frame {}</h2>'.format(i+1, key, frame))

    for fn in os.listdir(index_dir):
      if '.index' not in fn:
        continue
      print(fn)
      faiss_db = FaissSearch(recipe, index_fn=fn)
      results = faiss_db.search(vec, limit=opt.limit)
      # print(results)

      f.write('<h3>{}</h3>'.format(fn))
      f.write('\n')
      f.write('<div class="result">')
      for result in results:
        hash = result['hash']
        frame = result['frame']
        score = "{0:.2f}".format(round(result['distance'], 2))
        url = faiss_db.url_for(verified, hash, frame)
        f.write('<div><img src="{}"><span>{}</span></div>'.format(url, score))
      f.write('</div>')
      f.write('\n')
    f.write('</section>\n')
    f.write('\n')
    f.write('\n')
