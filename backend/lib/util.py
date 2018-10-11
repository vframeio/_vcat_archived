from subprocess import call
from django.conf import settings
from django.http import Http404, JsonResponse, HttpResponse
import simplejson
import shutil
import os
import uuid

def make_thumbnails(full_fn, path, fn, s3_client=None):
    def resize(tag, size, quality):
        thumb_path = os.path.join('/tmp', uuid.uuid4().hex + ".jpg")
        upload_path = os.path.join(path, tag + ".jpg")
        call([
            settings.CONVERT_PATH,
            full_fn,
            "-resize",
            size + 'x',
            "-quality",
            quality,
            thumb_path,
        ])
        if s3_client:
            print("upload > {}".format(upload_path))
            s3_client.upload_file(
                thumb_path,
                settings.S3['bucket'],
                upload_path,
                ExtraArgs={
                    'ContentType': 'image/jpg',
                    'ACL': 'public-read',
                    'StorageClass': 'REDUCED_REDUNDANCY',
                })

    resize("th", "160", "85")
    resize("sm", "320", "85")
    resize("md", "640", "100")
    resize("lg", "1280", "85")

def mkdir(path):
    try:
        print("mkdir {}".format(path))
        os.makedirs(path, exist_ok=True)
    except:
        print("problem making {}".format(path))
        pass

def destroy_path(tag, id):
    if not tag or not id:
        return
    base_dir = '{}/{}'.format(tag, id)
    base_path = os.path.join(settings.MEDIA_ROOT, base_dir)
    try:
        if os.path.exists(base_path):
            print("/!\\ DESTROY /!\\ {}".format(base_path))
            shutil.rmtree(base_path)
    except:
        pass

def json_response(func):
    """
    A decorator thats takes a view response and turns it
    into json. If a callback is added through GET or POST
    the response is JSONP.
    """
    def decorator(request, *args, **kwargs):
        objects = func(request, *args, **kwargs)
        if isinstance(objects, HttpResponse):
            return objects
        try:
            data = simplejson.dumps(objects)
            if 'callback' in request.GET:
                # a jsonp response!
                data = '%s(%s);' % (request.GET['callback'], data)
                return HttpResponse(data, "text/javascript")
        except:
            data = simplejson.dumps(objects)
        return HttpResponse(data, "application/json")
    return decorator
