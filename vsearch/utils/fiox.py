import sys
import os
from os.path import join
from enum import Enum
from glob import glob
import hashlib
import pymediainfo
from pprint import pprint
from pathlib import Path
from config import settings as cfg

"""
File I/O x Utilities
"""
class MediaType(Enum):
  INVALID = 0
  IMAGE = 1
  VIDEO = 2

image_types = ['jpg','gif','png','jpeg']
video_types = ['mp4','webm','mov','avi','mts']


def get_media_type(f):
  ext = os.path.splitext(f)[1][1:]
  if ext in image_types:
    return MediaType.IMAGE
  elif ext in video_types:
    return MediaType.VIDEO
  return MediaType.INVALID

def ensure_dir(d,parent=False):
  """Create directory if not exist
    :param d: (str) path to directory or file
    :param parent: create parent directory
  """
  if parent:
    d = os.path.dirname(d)
  if not os.path.isdir(d):
    os.makedirs(d,exist_ok=True)
  #d = Path(d) if not parent else Path(d).parent
  #if not d.exists():
  # d.mkdir(parents=True,exist_ok=True)

def get_input_list(fp_input,ext='mp4',recursive=False):
  """Return list of files to process
    :param d: file or directory
  """
  """
  TODO: support multiple extensions
  """
  if os.path.isdir(fp_input):
    #files = sorted(glob(join(fp_input,'**/*.{}'.format(ext)),recursive=recursive))
    files = sorted(glob(join(fp_input,'*.{}'.format(ext))))
  else:
    files = [fp_input]
  return files


def sha256(filename, block_size=65536):
  sha256 = hashlib.sha256()
  with open(filename, 'rb') as f:
      for block in iter(lambda: f.read(block_size), b''):
          sha256.update(block)
  return sha256.hexdigest()


def sha256_tree(sha256):
  """Split hash into branches with tree-depth for faster file indexing"""
  branch_size = cfg.HASH_BRANCH_SIZE
  tree_size = cfg.HASH_TREE_DEPTH * branch_size
  sha256_tree = [sha256[i:(i+branch_size)] for i in range(0,tree_size,branch_size)]
  return '/'.join(sha256_tree)


def mediainfo(fpath,raw=False):
  """Get media info using pymediainfo"""
  from pymediainfo import MediaInfo
  media_info_raw = MediaInfo.parse(fpath).to_data()
  media_info = {}
  if raw:
    for d in media_info_raw['tracks']:
      if d['track_type'] == 'Video':
        media_info['video'] = d
      elif d['track_type'] == 'Audio':
        media_info['audio'] = d
  else:
    for d in media_info_raw['tracks']:
      if d['track_type'] == 'Video':
        media_info['video'] = {
          'codec_cc':d['codec_cc'],
          'duration':int(d['duration']),
          'display_aspect_ratio':float(d['display_aspect_ratio']),
          'width':int(d['width']),
          'height':int(d['height']),
          'frame_rate':float(d['frame_rate']),
          'frame_count':int(d['frame_count']),
          }
  return media_info


def filename(fpath):
  """Return the filename without extension"""
  return os.path.splitext(os.path.basename(fpath))[0]
  


  """
  Mediainfo:
  codec_cc
  display_aspect_ratio
  frame_count
  width
  height
  frame_rate
  duration (in ms)
  """

  """
  format_url
  proportion_of_this_stream
  frame_count
  stream_identifier
  other_scan_type
  count_of_stream_of_this_kind
  interlacement
  codec_settings__cabac
  codec_id_info
  chroma_subsampling
  other_maximum_bit_rate
  other_kind_of_stream
  codec_cc
  track_type
  count
  codec_settings
  encoded_date
  format_settings__cabac
  other_bit_depth
  stored_height
  other_format_settings__reframes
  bits__pixel_frame
  format_profile
  other_stream_size
  other_track_id
  resolution
  format
  color_space
  sampled_height
  other_display_aspect_ratio
  other_width
  rotation
  codec_family
  framerate_mode_original
  other_interlacement
  other_height
  codec
  display_aspect_ratio
  duration
  bit_rate
  frame_rate_mode
  height
  sampled_width
  maximum_bit_rate
  pixel_aspect_ratio
  codec_id
  scan_type
  codec_url
  codec_info
  other_duration
  codec_settings_refframes
  streamorder
  tagged_date
  track_id
  other_format_settings__cabac
  format_settings__reframes
  other_codec
  bit_depth
  format_info
  other_frame_rate
  commercial_name
  frame_rate
  stream_size
  colorimetry
  other_frame_rate_mode
  internet_media_type
  format_settings
  kind_of_stream
  codec_id_url
  other_resolution
  codec_profile
  width
  other_bit_rate
  mediainfo
  None
  """

  