#!/usr/bin/env python3
from urllib.parse   import quote
from urllib.request import urlopen

import sys
import os
import os.path as osp
from queue import Queue
from threading import Thread
import logging
import os
from time import time
import json
#from urllib.request import urlopen, Request
import urllib.request
from urllib import parse
import shutil
import hashlib

# Python3 does not contain valid cert? for media server
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

"""
Rename
find . -depth -exec rename 's/(.*)\/([^\/]*)/$1\/\L$2/' {} \;

Remove spaces
for name in *\ *; do mv -v "$name" "${name/ /-}"; done   
"""

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logging.getLogger('requests').setLevel(logging.CRITICAL)

fh = logging.FileHandler('debug.log')
fh.setLevel(logging.ERROR)
formatter = logging.Formatter("%(name)s - %(levelname)s - %(message)s")
fh.setFormatter(formatter)
logger.addHandler(fh)


def sha256_checksum(filename, block_size=65536):
    sha256 = hashlib.sha256()
    with open(filename, 'rb') as f:
        for block in iter(lambda: f.read(block_size), b''):
            sha256.update(block)
    return sha256.hexdigest()

def file_exists(f,checksum):
  if osp.isfile(f):
    if checksum is None:
      return True
    else:
      f_checksum = sha256_checksum(f)
      return f_checksum == checksum
  else:
    return False

def download_link(fpath, url):
  global ctx
  logger.info('Downloading %s', url)
  #urlenc = urllib.parse.quote_plus(url)
  print(fpath)
  with urllib.request.urlopen(url,context=ctx) as response, open(fpath, 'wb') as out_file:
      shutil.copyfileobj(response, out_file)

def ensure_dir(d):
  print(d)
  if not os.path.isdir(d):
    os.makedirs(d)

class DownloadWorker(Thread):
   def __init__(self, queue):
       Thread.__init__(self)
       self.queue = queue

   def run(self):
       while True:
           # Get the work from the queue and expand the tuple
           d, url = self.queue.get()
           try:
             download_link(d, url)
           except:
            pass
           self.queue.task_done()

def get_videos(f):
  with open(f,encoding='utf-8') as f:
    videos = json.load(f)
  return videos

def main(args):
  ts = time()
  ensure_dir(args.output)

  # Create a queue to communicate with the worker threads
  queue = Queue()

  # Create 8 worker threads
  for x in range(args.threads):
    worker = DownloadWorker(queue)
    # Setting daemon to True will let the main thread exit even though the workers are blocking
    worker.daemon = True
    worker.start()

  # Get JSON files
  files = [osp.join(args.input,f) for f in os.listdir(args.input) if f.endswith('.json')]

  # for each file
  for f in files[:2]:
    bname = osp.basename(f)
    fname,ext = osp.splitext(bname)
    fdir = osp.join(args.output,fname)
    ensure_dir(fdir)

    videos = get_videos(f)

    # Put the tasks into the queue as a tuple
    for video in videos:
      v_hash = video['_lf_id_hash']
      v_url = video['_dl']
      if 'ftp:' in v_url:
        print(100*'*')
        print(v_url)
        print(100*'*')
        continue
      if 'https' in v_url:
        v_url = v_url.replace('https','http')
      if not 'http' in v_url:
        v_url = 'http://{}'.format(v_url)
      #v_url = parse.unquote(v_url)
      # v_url = parse.quote(v_url)
      if len(video['_lf_downloads']) > 0:
        try:
          v_checksum = video['_lf_downloads'][0]['sha256']
        except:
          v_checksum = None
          #logger.error("[-] Could not download {} file: {}, hash: {}".format(fname,v_url,v_hash))
          logger.error("[-] No checksum {} file: {}, hash: {}".format(fname,v_url,v_hash))

      fpath = osp.join(fdir,v_hash + '.mp4')
      if not file_exists(fpath,v_checksum):
        logger.info('Queueing {} - {}'.format(fname,v_url))
        queue.put((fpath, v_url))
      
    # Causes the main thread to wait for the queue to finish processing all the tasks
    queue.join()
    print('Took {}'.format(time() - ts))


if __name__ == '__main__':
    import argparse
    output_default = '/data_store/apps/syrian_archive/videos/snapshot_20171115'
    input_default = '/data_store/apps/syrian_archive/videos/json/'
    ap = argparse.ArgumentParser()
    ap.add_argument('-o','--output',default=output_default)
    ap.add_argument('-i','--input',default=input_default)
    # limit
    # offset
    ap.add_argument('-t','--threads',default=8)
    args = ap.parse_args()
    main(args)