from django.conf import settings
from django.http import Http404, HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
from rest_framework import status, generics
from django_filters.rest_framework import DjangoFilterBackend

from backend.images.models import Image, ImageGroup
from backend.images.serializers import (ImageSerializer,
SavedImageSerializer, ImageSearchSerializer, UpdateImageSerializer,
ImageGroupSerializer, ImageGroupItemSerializer, SavedImageGroupSerializer)

from backend.lib.upload_view import UploadView
from backend.lib.util import destroy_path

import uuid
from subprocess import call
import os
from django.db.models.signals import pre_delete
from django.dispatch import receiver

IMAGES_FOLDER = 'images'

# general image api's

class ImageList(generics.ListAPIView):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    pagination_class = LimitOffsetPagination

class UserImageList(generics.ListAPIView):
    serializer_class = ImageSerializer
    pagination_class = LimitOffsetPagination
    def get_queryset(self):
        user = self.request.user
        return Image.objects.filter(user=self.request.user)

class NonannotatedUserImageList(generics.ListAPIView):
    serializer_class = ImageSerializer
    pagination_class = LimitOffsetPagination
    def get_queryset(self):
        user = self.request.user
        return Image.objects.filter(user=self.request.user, region_count=0)

class AnnotatedUserImageList(generics.ListAPIView):
    serializer_class = ImageSerializer
    pagination_class = LimitOffsetPagination
    def get_queryset(self):
        user = self.request.user
        return Image.objects.filter(user=self.request.user, region_count__gt=0)

class ImageUpdate(generics.UpdateAPIView):
    queryset = Image.objects.all()
    serializer_class = UpdateImageSerializer

class ImageDetail(generics.RetrieveDestroyAPIView):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer

class ImageUpload(UploadView):
    def post(self, request, format=None):

        group_serializer = SavedImageGroupSerializer(data=request.data)

        if not group_serializer.is_valid():
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        group_serializer.save()

        image_group = group_serializer.data

        records = self.prepare_files(request)
        valid = []
        for record in records:
            initial_data = { **request.data }
            initial_data['user'] = request.user.pk
            initial_data['name'] = request.user.username
            initial_data['fn'] = record['fn']
            initial_data['ext'] = record['ext']
            initial_data['phash'] = record['phash']
            initial_data['original_fn'] = record['original_fn']
            initial_data['from_sa'] = 'true' in initial_data['from_sa']
            initial_data['graphic'] = 'true' in initial_data['graphic']
            initial_data['image_group'] = image_group['id']
            # so strange that these are arrays- the serializer should handle these
            if 'source_url' in initial_data:
                initial_data['source_url'] = initial_data['source_url'][0]
            if 'sa_hash' in initial_data:
                initial_data['sa_hash'] = initial_data['sa_hash'][0]
            if 'tags' in initial_data:
                initial_data['tags'] = initial_data['tags'][0]
            if 'description' in initial_data:
                initial_data['description'] = initial_data['description'][0]
            serializer = SavedImageSerializer(data=initial_data)

            if serializer.is_valid():
                serializer.save()

                base_dir = '{}/{}'.format(IMAGES_FOLDER, serializer.data['id'])
                base_path = self.make_path(base_dir)
                self.write_file(record, base_path)
                valid.append(serializer.data)

        if len(valid):
            return Response(valid, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# image search using perceptual hash

class ImageSearch(UploadView):
    def put(self, request, format=None):
        f = self.get_file(request)
        phash = self.phash(f.file)
        images = Image.objects.raw('SELECT images_image.*, BIT_COUNT(phash ^ %s) as hamming_distance FROM images_image HAVING hamming_distance < 10 ORDER BY hamming_distance ASC LIMIT 5', [phash])
        serializer = ImageSearchSerializer(images, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# image groups

class ImageGroupList(generics.ListAPIView):
    queryset = ImageGroup.objects.all()
    serializer_class = ImageGroupSerializer
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('assigned_to',)

class ImageGroupCreate(generics.CreateAPIView):
    queryset = ImageGroup.objects.all()
    serializer_class = ImageGroupItemSerializer

class ImageGroupDetail(generics.RetrieveDestroyAPIView):
    queryset = ImageGroup.objects.all()
    serializer_class = ImageGroupSerializer

class ImageGroupUpdate(generics.UpdateAPIView):
    queryset = ImageGroup.objects.all()
    serializer_class = ImageGroupItemSerializer

# delete image files before deleting image objects

@receiver(pre_delete, sender=Image)
def delete_images(sender, instance, **kwargs):
    destroy_path(IMAGES_FOLDER, instance.id)
