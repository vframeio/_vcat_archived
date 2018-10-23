import json
import os
import uuid
from shutil import copyfile

from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.db import connection
from datetime import datetime, timedelta
from django.conf import settings

from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from backend.lib.import_view import ImportView
from .models import Image, ImageGroup
from backend.lib.util import make_thumbnails, mkdir
from backend.images.serializers import SavedImageSerializer, SavedImageGroupSerializer

IMAGES_FOLDER = 'images'

class ImportView(ImportView):
  def post(self, request, format=None):
    data = json.loads(request.body.decode("utf-8"))
    print(str(settings.IMPORT_DIR.path("../index.html")))
    print(request.user)

    group_data = {
      'sa_hash': data['title'],
      'from_sa': True,
      'source_url': '',
    }

    group_serializer = SavedImageGroupSerializer(data=group_data)

    if not group_serializer.is_valid():
      return Response(serializer.errors,
                      status=status.HTTP_400_BAD_REQUEST)
    group_serializer.save()

    image_group = group_serializer.data

    for url in data['urls']:
      print(url)

      # https://fax-vframe.ams3.digitaloceanspaces.com/v1/media/keyframes/unverified/27ad...979b/[frame]/lg/index.jpg
      path, index_jpg = os.path.split(url)
      path, size = os.path.split(path)
      path, sa_hash = os.path.split(path)
      if len(sa_hash) == 6:
        frame = sa_hash
        path, sa_hash = os.path.split(path)
        original_fn = "{}/{}".format(sa_hash, frame)
      else:
        frame = ''
        original_fn = "{}".format(sa_hash)
      if 'unverified' in path:
        verified = False
      else:
        verified = True

      phash = self.phash_url(url)

      print("{} {} {}".format(path, sa_hash, frame))

      initial_data = {}
      initial_data['user'] = request.user.pk
      initial_data['name'] = request.user.username
      initial_data['base_href'] = path
      initial_data['verified'] = verified
      initial_data['sa_hash'] = sa_hash
      initial_data['frame'] = frame
      initial_data['fn'] = 'index'
      initial_data['ext'] = '.jpg'
      initial_data['phash'] = phash
      initial_data['original_fn'] = original_fn
      initial_data['from_sa'] = True
      initial_data['uploaded'] = False
      initial_data['graphic'] = data['graphic']
      initial_data['image_group'] = image_group['id']
      serializer = SavedImageSerializer(data=initial_data)

      if serializer.is_valid():
        serializer.save()
      else:
        print("data is not valid...")
        print(serializer.errors)

        # base_dir = '{}/{}'.format(IMAGES_FOLDER, serializer.data['id'])
        # base_path = os.path.join(settings.MEDIA_ROOT, base_dir)
        # mkdir(base_path)

        # full_fn = os.path.join(base_path, orig_fn)
        # copyfile(src, full_fn)

        # thumb_path = os.path.join(base_path, fn)
        # mkdir(thumb_path)
        # make_thumbnails(full_fn, thumb_path, fn)

    return JsonResponse({ 'image_group': image_group })

class SearchView(ImportView):
  def post(self, request, format=None):
    data = json.loads(request.body.decode("utf-8"))
    good = []
    bad = []
    for url in data['urls']:
      phash = self.phash_url(url)
      images = Image.objects.raw('SELECT images_image.*, BIT_COUNT(phash ^ %s) as hamming_distance FROM images_image HAVING hamming_distance < 6 ORDER BY hamming_distance ASC LIMIT 1', [phash])
      if len(list(images)):
        bad.append({ 'url': url, 'image': images[0] })
      else:
        good.append(url)
    return JsonResponse({
      'bad': bad,
      'good': good,
    })

