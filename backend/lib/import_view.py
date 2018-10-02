from django.conf import settings
from django.http import Http404, HttpResponse
from rest_framework.views import APIView

import io
import uuid
import shutil
import os
import imagehash
import PIL
import numpy
import struct
import urllib.request

from .util import make_thumbnails, mkdir

class ImportView(APIView):
    def phash (self, file):
        phash = imagehash.phash(PIL.Image.open(file))
        # phash.hash[0] = False
        phash.hash[-1] = False
        phash_as_bigint = struct.unpack('Q', numpy.packbits(phash.hash))[0]
        return phash_as_bigint

    def phash_url (self, url):
        request = urllib.request.Request(url)
        response = urllib.request.urlopen(request)
        raw = response.read()
        phash = imagehash.phash(PIL.Image.open(io.BytesIO(raw)))
        # phash.hash[0] = False
        phash.hash[-1] = False
        phash_as_bigint = struct.unpack('Q', numpy.packbits(phash.hash))[0]
        return phash_as_bigint

    def make_path(self, base_dir):
        base_path = os.path.join(settings.MEDIA_ROOT, base_dir)
        mkdir(base_path)
        return base_path
