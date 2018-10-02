from django.conf import settings
from django.http import Http404, HttpResponse
from rest_framework.views import APIView

import uuid
from subprocess import call
import shutil
import os
import imagehash
import PIL
import numpy
import struct
import boto3
import mimetypes

s3_client = None

if settings.FILE_STORAGE == 's3':
    print("Using S3 file storage")
    session = boto3.session.Session()

    s3_client = session.client(
        service_name='s3',
        aws_access_key_id=settings.S3['key'],
        aws_secret_access_key=settings.S3['secret'],
        endpoint_url=settings.S3['endpoint'],
        region_name=settings.S3['region'],
    )

    response = s3_client.list_buckets()

    # Get a list of all bucket names from the response
    buckets = [bucket['Name'] for bucket in response['Buckets']]

    # Print out the bucket list
    print("Bucket List: %s" % buckets)
    if settings.S3['bucket'] not in buckets:
        print("Creating bucket: {} ".format(settings.S3['bucket']))
        s3_client.create_bucket(Bucket=settings.S3['bucket'])
else:
    print("Using local file storage")

from .util import make_thumbnails, mkdir

class UploadView(APIView):
    def phash (self, file):
        phash = imagehash.phash(PIL.Image.open(file))
        # phash.hash[0] = False
        phash.hash[-1] = False
        phash_as_bigint = struct.unpack('Q', numpy.packbits(phash.hash))[0]
        return phash_as_bigint

    def get_file(self, request):
        files = request.FILES.getlist('file')
        return files[0]

    def prepare_files(self, request):
        files = request.FILES.getlist('file')
        records = []
        for f in files:
            fn = uuid.uuid4().hex
            raw_fn, ext = os.path.splitext(f.name)
            phash = self.phash(f.file)
            rec = {
              'fn': fn,
              'ext': ext,
              'original_fn': f.name,
              'file': f,
              'phash': phash,
            }
            records.append(rec)
        return records

    def handle_upload(self, request, base_dir):
        global s3_client
        print(s3_client)

        if s3_client is not None:
            base_path = '/media/' + base_dir
        else:
            base_path = os.path.join(settings.MEDIA_ROOT, base_dir)
            mkdir(base_path)

        files = request.FILES.getlist('file')
        records = []
        for f in files:
            fn = uuid.uuid4().hex
            raw_fn, ext = os.path.splitext(f.name)

            orig_fn = fn + ext
            full_fn = os.path.join(base_path, orig_fn)

            if s3_client is not None:
                print("uploading to s3")
                print(full_fn)

                thumb_path = os.path.join('/tmp', orig_fn)
                fout = open(thumb_path, 'wb+')
                for chunk in f.chunks():
                    fout.write(chunk)
                fout.close()

                obj = client.upload_file(
                    thumb_path,
                    settings.S3['bucket'],
                    full_fn,
                    ExtraArgs={
                        'ACL': 'public-read',
                    })

                # make_thumbnails(thumb_path, '/tmp', fn, s3_client)

            else:
                fout = open(full_fn, 'wb+')
                for chunk in f.chunks():
                    fout.write(chunk)
                fout.close()

                thumb_path = os.path.join(base_path, fn)
                mkdir(thumb_path)
                make_thumbnails(full_fn, thumb_path, fn, s3_client)

            records.append({
              'fn': fn,
              'ext': ext,
              'original_fn': f.name,
            })

        return records

    def make_path(self, base_dir):
        if s3_client is not None:
            return os.path.join('media', base_dir)
        base_path = os.path.join(settings.MEDIA_ROOT, base_dir)
        mkdir(base_path)
        return base_path

    def write_file(self, record, base_path):
        global s3_client
        print(base_path)
        
        fn = record['fn']
        ext = record['ext']
        orig_fn = fn + ext

        if s3_client is not None:
            # base_path = '/media/' + base_dir
            full_fn = os.path.join(base_path, orig_fn)

            thumb_path = os.path.join('/tmp', orig_fn)
            fout = open(thumb_path, 'wb+')
            for chunk in record['file'].chunks():
                fout.write(chunk)
            fout.close()

            print("upload > {}".format(full_fn))
            s3_client.upload_file(
                thumb_path,
                settings.S3['bucket'],
                full_fn,
                ExtraArgs={
                    'ContentType': mimetypes.guess_type(orig_fn)[0],
                    'ACL': 'public-read',
                    'StorageClass': 'REDUCED_REDUNDANCY',
                })

            make_thumbnails(thumb_path, os.path.join(base_path, fn), fn, s3_client)

        else:
            base_path = os.path.join(settings.MEDIA_ROOT, base_dir)

            mkdir(base_path)

            full_fn = os.path.join(base_path, orig_fn)

            fout = open(full_fn, 'wb+')
            for chunk in record["file"].chunks():
                fout.write(chunk)
            fout.close()

            thumb_path = os.path.join(base_path, fn)
            mkdir(thumb_path)
            make_thumbnails(full_fn, thumb_path, fn)


# sample for image "append"
#
# class ImageUpload(UploadView):
#     def get_object(self, pk):
#         try:
#             return Image.objects.get(pk=pk)
#         except Image.DoesNotExist:
#             raise Http404
#     def post(self, request, pk, format=None):
#         parent = self.get_object(pk)
#         base_dir = 'images/{}'.format(pk)
#         self.handle_upload(request, base_dir)
#         serializer = HierarchyItemSerializer(parent)
#         return Response(serializer.data)
