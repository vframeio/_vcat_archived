import os
import sys
from os.path import join
from pathlib import Path
import csv
import shutil
import json
from tqdm import tqdm
from glob import glob
from pathlib import Path
import cv2 as cv
from PIL import Image
import imutils
# local
sys.path.append('/vframe/tools')
from config import settings as cfg
from . import fiox
from . import imx


class FileManagement:

  def __init__(self):
    pass

  def create_sha256_symlinks(self, kwargs):
    """Convert a directory into another directory of symlinked sha256-named files"""

    files_orig = glob(join(kwargs['input'],'**/*'),recursive=True)
    valid_exts = tuple(a.strip() for a in kwargs['exts'].split(','))
    files = [f for f in files_orig if Path(f).suffix.lower().endswith(valid_exts)]
    print('[+] Found {}. Skipping {} files '.format(len(files),len(files_orig)-len(files)))

    # create symlinks
    skipped = []
    mappings = []
    for fp_src in tqdm(files):
      sha256 = fiox.sha256(fp_src)
      ext = Path(fp_src).suffix
      if kwargs['hash_tree']:
        # subdvide hash into branches for faster file indexing
        sha256_tree = fiox.sha256_tree(sha256)
        fp_dst = join(kwargs['output'],sha256_tree,'{}{}'.format(sha256,ext))
      else:
        fp_dst = join(kwargs['output'],'{}{}'.format(sha256,ext))

      # first check if parent directory exists
      mappings.append({'filepath':fp_dst,'sha256':sha256,'ext':ext})

      if Path(fp_dst).parent.exists():
        # then check if symlink exists
        if Path(fp_dst).is_symlink():
          if kwargs['force']:
            print('[+] unlinking: {}'.format(fp_dst))
            Path(fp_dst).unlink()
          else:
            skipped.append(fp_dst)
            continue

      # Create symlinked file
      fiox.ensure_dir(fp_dst,parent=True)
      os.symlink(fp_src,fp_dst)

    # print summary
    nskipped = len(skipped)
    print('[+] Created {} symlinked sha256 hash files'.format(len(files)-nskipped))
    print('[+] Skipped {} duplicate files'.format(nskipped))
    return mappings


  def get_sugarcube_mappings(self,kwargs):
    """Convert mappings.csv file from Syrian Archive 
      into dict of sha256 and LF location
    """

    # sa_id,sha256,md5,location,verified
    mappings = csv.DictReader(kwargs['input'])
    mappings = [item for item in mappings]
    mappings_keep = []

    # Convert Syrian Archive mapping file into JSON files for non/verified
    print('[+] Reading mappings...')

    for mapping in tqdm(mappings):
      # if no video file is listed, skip
      fp_lf = mapping['location']
      if fp_lf is None or fp_lf == '':
        continue
      verified = mapping.get('verified','').lower() == 'true'
      if verified != kwargs['verified']:
        continue
      # only append files that match the verified status
      sha256 = mapping['sha256']
      sha256_tree = fiox.sha256_tree(sha256)
      bname = Path(fp_lf).name
      ext = Path(fp_lf).suffix.replace('.','')
      fp_input = kwargs.get('media_src',None)
      if fp_input is not None:
        fp_linked = os.path.join(kwargs['media_src'],sha256_tree,'{}.{}'.format(sha256,ext))
      else:
        fp_linked = None
      mappings_keep.append({'sha256':sha256, 'filepath':fp_linked,'ext':ext})

    return mappings_keep