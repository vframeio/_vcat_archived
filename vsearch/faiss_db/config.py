import time
import json
import pickle
from os import path
from collections import namedtuple

# Converts JSON el['key'] to Pythonic object-style el.key
def _json_object_hook(d):
  return namedtuple('X', d.keys())(*d.values())

# Load a JSON recipe
def load(path):
  with open(path) as fh:
    return json.load(fh, object_hook=_json_object_hook)

# Load a pickle file
def load_pickle(data_dir, pkl_fn):
  load_start = time.time()
  with open(path.join(str(data_dir), str(pkl_fn)), 'rb') as fh:
    raw = fh.read()
    data = pickle.loads(raw)
    load_end = time.time()
    load_time = load_end - load_start
    print("Pickle load time: {:.1f}s".format(load_time))
    return data
