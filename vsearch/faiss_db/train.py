#!python

import os
from os import path
from pathlib import Path
import faiss
import numpy as np
import sqlite3
import time
import csv
import sys
import argparse

import config

parser = argparse.ArgumentParser()
parser.add_argument('--config', required=True)
parser.add_argument('--factory_type')
parser.add_argument('--reset_db', action='store_true')
parser.add_argument('--store_db', action='store_true')
parser.add_argument('--test_search', action='store_true')
parser.add_argument('--store_timing', action='store_true')
parser.add_argument('--test_factory_types', action='store_true')
opt = parser.parse_args()

recipe = config.load(opt.config)

dataset = recipe.dataset
factory_type = opt.factory_type or recipe.faiss.factory_type

base_dir = path.join(path.dirname(path.abspath(__file__)), "..")
data_dir = path.join(base_dir, "datasets", dataset)

db_fn = path.join(base_dir, "datasets", dataset, "index", "sqlite3.db")
index_fn = path.join(base_dir, "datasets", dataset, "index", "faiss-{}.index".format(factory_type.replace(',', '_')))

db = sqlite3.connect(db_fn)
index = faiss.index_factory(recipe.features.dimension, factory_type)

# Build a new FAISS index from the dataset
def build(factory_type):
  if opt.store_db:

    print("Creating database...")
    cursor = db.cursor()
    cursor.execute("""DROP TABLE IF EXISTS frames""")
    cursor.execute("""CREATE TABLE frames(id INTEGER PRIMARY KEY, verified INTEGER, hash TEXT, frame TEXT)""")
    db.commit()

  train_time = 0
  add_time = 0
  test_time = 0

  print("Factory type: {}".format(factory_type))
  data_paths = list(Path(path.join(data_dir, 'data')).glob('*.pkl'))
  if recipe.faiss.train == '' or recipe.faiss.train == 'dataset':
    train_path = data_paths[0]
  else:
    train_path = recipe.faiss.train
  train_time = train(train_path)

  for file_index, fn in enumerate(data_paths):
    add_time += add(file_index, fn)

  faiss.write_index(index, index_fn)

  if opt.test_search:
    test_time = test(train_path)

  if opt.store_timing:
    with open("timing.csv", "a") as f:
      index_size = os.path.getsize(index_fn)
      print("Index size: {:.1f} MB".format(index_size / (1024 * 1024)))
      writer = csv.writer(f)
      writer.writerow([
        dataset,
        index.ntotal,
        recipe.features.dimension,
        factory_type,
        '{:.1f}'.format(train_time),
        '{:.1f}'.format(add_time),
        '{:.1f}'.format(test_time),
        '{:.1f}'.format(index_size / (1024 * 1024))
      ])

# Build multiple indexes using different factory_types
def build_test_factories():
  global index, index_fn
  for factory_type in recipe.faiss.test_factory_types:
    index_fn = path.join(base_dir, "datasets", dataset, "index", "faiss-{}.index".format(factory_type.replace(',', '_')))
    index = faiss.index_factory(recipe.features.dimension, factory_type)
    build(factory_type)

# Pre-train the FAISS discriminator (some algorithms skip this step).
# Training should be done on the whole dataset (medium-sized) or a subset (large-sized).
def train(fn):
  data = config.load_pickle(data_dir, fn)
  field = recipe.features.field

  feats = np.array([ data[v]['metadata'][field][frame] for v in data.keys() for frame in data[v]['metadata'][field].keys() ]).astype('float32')
  n, d = feats.shape

  train_start = time.time()
  index.train(feats)
  train_end = time.time()
  train_time = train_end - train_start
  print("Train time: {:.1f}s".format(train_time))

  return train_time

# Add vectors to the index.
def add(file_index, fn, verified='0'):
  data = config.load_pickle(data_dir, path.join("data", str(fn)))
  return add_photos(file_index, data, verified) + add_videos(file_index, data, verified)

def add_photos(file_index, data, verified):
  if 'photos' not in data:
    return 0

  if opt.store_db:
    cursor = db.cursor()
    for hash in data['photos'].keys():
      cursor.execute('''INSERT INTO frames(verified, hash, frame) VALUES(?,?,?)''', (verified, hash, '-1'))
    db.commit()

  feats = np.array([ data['photos'][hash] for hash in data['photos'].keys() ])
  n, d = feats.shape

  if d != recipe.features.dimension:
    print("Dimensions don't match: {} vs {}".format(d, recipe.features.dimension))
    sys.exit(1)

  print("Processing {} x {}d features from photos...".format(n, d))

  add_start = time.time()
  index.add(feats)
  add_end = time.time()
  add_time = add_end - add_start
  print("Add time: {:.1f}s".format(add_time))
  return add_time

def add_videos(file_index, data, verified):
  field = recipe.features.field

  if opt.store_db:
    cursor = db.cursor()
    for hash in data.keys():
      for frame in sorted(data[hash]['metadata'][field].keys()):
        cursor.execute('''INSERT INTO frames(verified, hash, frame) VALUES(?,?,?,?)''', (verified, hash, frame))
    db.commit()

  feats = np.array([ data[hash]['metadata'][field][frame] for hash in data.keys() for frame in sorted(data[hash]['metadata'][field].keys()) ]).astype('float32')
  n, d = feats.shape

  if d != recipe.features.dimension:
    print("Dimensions don't match: {} vs {}".format(d, recipe.features.dimension))
    sys.exit(1)

  print("Processing {} x {}d features from videos...".format(n, d))

  add_start = time.time()
  index.add(feats)
  add_end = time.time()
  add_time = add_end - add_start
  print("Add time: {:.1f}s".format(add_time))
  return add_time

# Sanity check the index.
def test(fn, limit=15):
  data = config.load_pickle(data_dir, fn)

  keys = list(data.keys())
  key = keys[0]
  frames = list(data[key].keys())
  frame = frames[0]
  vec = data[key][frame]
  test_start = time.time()
  D, I = index.search(np.array([vec]).astype('float32'), limit)
  test_end = time.time()
  test_time = test_end - test_start
  print("Lookup time: {:.1f}s".format(test_time))
  return test_time

if __name__ == '__main__':
  if opt.test_factory_types:
    build_test_factories()
  else:
    build(factory_type)
