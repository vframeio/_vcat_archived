#!python

import sys
import json
import argparse
import numpy as np
import random
import os
import sqlite3
from os import path

import config
from db import FaissSearch

parser = argparse.ArgumentParser()
parser.add_argument('--config', required=True)
parser.add_argument('--mediarecord_dir', type=str, default="/data_store/apps/syrianarchive/metadata/media_record")
parser.add_argument('--verified', type=int, default=1)
opt = parser.parse_args()

recipe = config.load(opt.config)
faiss_db = FaissSearch(recipe)

dataset = recipe.dataset

# base_dir = path.join(path.dirname(path.abspath(__file__)), "..")
data_dir = opt.mediarecord_dir
pkl_fn = "verified.pkl"

data = config.load_pickle(data_dir, pkl_fn)

verified = opt.verified

count = 0
for hash in data.keys():
  if (count % 1000) == 0:
    print("{}...".format(count))
  count += 1
  q = '''
    UPDATE frames SET verified = ? WHERE hash = ?
  '''
  cursor = faiss_db.db.cursor()
  cursor.execute(q, (str(verified), hash,))
  faiss_db.db.commit()
print("Marked {} keys verified.".format(count))
