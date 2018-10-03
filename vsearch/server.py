#!python

import sys
import json
import argparse
import cv2 as cv
import numpy as np
import urllib.request
from datetime import datetime
from flask import Flask, request, render_template, jsonify
from PIL import Image  # todo: try to remove PIL dependency

from faiss_db.db import FaissSearch
import faiss_db.config as config

from feature_extractor import FeatureExtractor

parser = argparse.ArgumentParser()
parser.add_argument('--config', default='./recipes/db_resnet18.json')
parser.add_argument('--factory_type')
opt = parser.parse_args()

recipe = config.load(opt.config)

dataset = recipe.dataset
factory_type = opt.factory_type or recipe.faiss.factory_type

fe = FeatureExtractor(config=recipe)
db = FaissSearch(recipe, factory_type)

DEFAULT_LIMIT = 50

# print(json.dumps(results, indent=2))

app = Flask(__name__, static_url_path="/search/static", static_folder="static")

# static api routes - this routing is actually handled in the JS
@app.route('/', methods=['GET'])
def index():
  return app.send_static_file('index.html')
@app.route('/search/', methods=['GET'])
def search_index():
  return app.send_static_file('index.html')
@app.route('/search/<path:path>', methods=['GET'])
def search_path(path):
  return app.send_static_file('index.html')
@app.route('/metadata/', methods=['GET'])
def metadata_index():
  return app.send_static_file('metadata.html')
@app.route('/metadata/<path:path>', methods=['GET'])
def metadata_path(path):
  return app.send_static_file('metadata.html')

# this is a vcat endpoint, included here as a no-op.
@app.route('/api/images/import/search/', methods=['POST'])
def import_():
    return jsonify({ 'good': [], 'bad': [] })

# query a mediarecord
@app.route('/search/api/mediarecord/<sha>', methods=['GET'])
def mediarecord(sha):
  return jsonify(db.mediarecord(sha) or { 'err': 'Hash not found' })

# list a directory
@app.route('/search/api/list/<sha>', methods=['GET'])
def list(sha):
  frames = db.browse(sha)
  return jsonify({
    'path': sha,
    'results': frames,
  })

# search using an uploaded file
@app.route('/search/api/upload', methods=['POST'])
def upload():
  try:
    limit = int(request.args.get('limit'))
  except:
    limit = DEFAULT_LIMIT
  file = request.files['query_img']
  fn = file.filename
  if fn.endswith('blob'):
      fn = 'filename.jpg'
  # how to refactor this to get it to
  img = Image.open(file.stream)
  uploaded_img_path = "static/uploaded/" + datetime.now().isoformat() + "_" + fn
  img.save(uploaded_img_path)
  img = cv.imread(uploaded_img_path)
  print('query: {}'.format(uploaded_img_path))
  #vec = fe.extract(uploaded_img_path)
  vec = fe.extract(img)
  results = db.search(vec, limit=limit)
  return jsonify({
    'query': { 'url': uploaded_img_path },
    'results': results,
  })

# search using a specific file from the database
@app.route('/search/api/search/<int:file>/<hash>/<frame>', methods=['GET'])
def search(file, hash, frame):
  offset, limit = get_offset_and_limit()
  results, query = db.search_by_frame(file, hash, frame, offset=offset, limit=limit)
  return jsonify({
    'query': query,
    'results': results,
  })

# search using a random file from the database
@app.route('/search/api/random', methods=['GET'])
def random():
  offset, limit = get_offset_and_limit()
  results, query = db.search_random(limit=limit)
  return jsonify({
    'query': query,
    'results': results,
  })

# search using an external url
@app.route('/search/api/fetch/', methods=['GET'])
def fetch():
  offset, limit = get_offset_and_limit()
  url = request.args.get('url')
  print("fetching url: {}".format(url))
  if url.startswith('static'):
    img = cv.imread(url)
  else:
    response = urllib.request.urlopen(url)
    data = response.read()
    print("got response: {}".format(len(data)))
    np_img = np.fromstring(data, dtype=np.uint8); 
    img = cv.imdecode(np_img, 1)
  query = fe.extract(img)
  results = db.search(query, limit=limit)
  return jsonify({
    'query': { 'url': url },
    'results': results,
  })

# tidy up search arguments
def get_offset_and_limit():
  try:
    limit = int(request.args.get('limit'))
  except:
    limit = DEFAULT_LIMIT
  try:
    offset = int(request.args.get('offset'))
  except:
    offset = 0
  return offset, limit

if __name__=="__main__":
    app.run("0.0.0.0", debug=False)

