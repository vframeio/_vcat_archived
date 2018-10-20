from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.db import connection
from datetime import datetime, timedelta

from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class ImageStats(APIView):
  def get(self, request, format=None):
    cursor = connection.cursor()

    user_complete_count = 0
    user_incomplete_count = 0

    cursor.execute("SELECT id FROM images_imagegroup WHERE assigned_to_id = %s", [request.user.id])
    group_ids = [str(i[0]) for i in cursor.fetchall()]

    if len(group_ids):
      group_ids_str = ",".join(group_ids)
      cursor.execute("SELECT count(*) AS count FROM images_image WHERE complete=1 AND image_group_id IN ({})".format(group_ids_str))
      user_complete_count = cursor.fetchone()[0]

      cursor.execute("SELECT count(*) AS count FROM images_image WHERE complete=0 AND image_group_id IN ({})".format(group_ids_str))
      user_incomplete_count = cursor.fetchone()[0]

    cursor.execute("SELECT count(*) AS count FROM images_image WHERE complete=1 AND image_group_id IS NOT NULL")
    complete_count = cursor.fetchone()[0]

    cursor.execute("SELECT count(*) AS count FROM images_image WHERE complete=0 AND image_group_id IS NOT NULL")
    incomplete_count = cursor.fetchone()[0]

    cursor.execute("SELECT count(*) AS count FROM editor_imageregion")
    annotation_count = cursor.fetchone()[0]

    cursor.execute("SELECT count(*) AS count FROM editor_imageregion WHERE user_id = %s", [request.user.id])
    user_annotation_count = cursor.fetchone()[0]

    last_day = datetime.now() - timedelta(days = 1)
    last_day.strftime('%Y-%m-%d %H:%M:%S')
    cursor.execute("SELECT count(*) AS count FROM editor_imageregion WHERE created_at > %s", [last_day])
    annotations_today = cursor.fetchone()[0]

    print(request.user)

    data = {
      'image': {
        'total': complete_count + incomplete_count,
        'complete': complete_count,
        'incomplete': incomplete_count,
        'user_total': user_complete_count + user_incomplete_count,
        'user_complete': user_complete_count,
        'user_incomplete': user_incomplete_count,
      },
      'annotations': {
        'user': user_annotation_count,
        'total': annotation_count,
        'today': annotations_today,
      }
    }

    return JsonResponse(data)

# apply quoted parameters like this:
# ('SELECT * FROM myapp_person WHERE last_name = %s', [lname])