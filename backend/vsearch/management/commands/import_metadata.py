#!python

import os
import sys
import time
import pickle
import argparse
import cv2 as cv
import simplejson as json
import ijson.backends.yajl2 as ijson

from django.core.management.base import BaseCommand, CommandError
from backend.vsearch.models import Document, DocumentTag

class Command(BaseCommand):
  help = 'Import metadata JSON files into the database'

  def add_arguments(self, parser):
    parser.add_argument('--ijson', action='store_true')
    parser.add_argument('--unverified', action='store_true', default=False)

  def handle(self, *args, **options):
    self.stdout.write(str(options))

    for tag in DocumentTag.objects.all():
      self.load(tag, 'verified')
      if options['unverified']:
        self.load(tag, 'unverified')

  def load(self, tag, verified):
      path = "/data_store/apps/syrianarchive/metadata/{}/{}".format(tag.name, verified)
      filename = os.path.join(path, 'index.pkl')
      if not os.path.exists(filename):
        self.stdout.write("Not found: {}".format(filename))
        return
      self.stdout.write("Importing {}".format(filename))
      data = load_pickle(path, 'index.pkl')
      index = 0
      for item in data.values():
        Document.objects.create(
          tag=tag,
          sha256=item['sha256'],
          data=json.dumps(item, separators=(',', ':'))
        )
        index += 1
        if (index % 1000) == 0:
          self.stdout.write("{}...".format(index))
      self.stdout.write(self.style.SUCCESS('Imported {}'.format(filename)))

# if we someday store binary sha256: int(item['sha256'], 16)

def load_pickle(data_dir, pkl_fn):
  load_start = time.time()
  with open(os.path.join(str(data_dir), str(pkl_fn)), 'rb') as fh:
    raw = fh.read()
    data = pickle.loads(raw)
    load_end = time.time()
    load_time = load_end - load_start
    print("Pickle load time: {:.1f}s".format(load_time))
    return data
