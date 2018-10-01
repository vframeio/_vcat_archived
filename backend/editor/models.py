from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from backend.images.models import Image
from backend.videos.models import Video
import datetime

class ImageRegion(models.Model):
  user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
  image = models.ForeignKey("images.Image", related_name='regions', null=False, on_delete=models.CASCADE)
  tag = models.ForeignKey("hierarchy.Hierarchy", related_name='regions', null=True, on_delete=models.CASCADE)
  x = models.FloatField(default=0.0)
  y = models.FloatField(default=0.0)
  width = models.FloatField(default=0.0)
  height = models.FloatField(default=0.0)
  t = models.FloatField(default=0.0)
  created_at = models.DateTimeField(auto_now_add=True, blank=True)
  updated_at = models.DateTimeField(auto_now=True, blank=True)

  class Meta:
    ordering = ('id',)


from django.db import connection, transaction
from django.db.models.signals import post_delete, post_save

def update_region_count(instance, **kwargs):
    """
    Updates the region count for the image related to the given region.
    """
    if not kwargs.get('created', True) or kwargs.get('raw', False):
        return
    cursor = connection.cursor()
    cursor.execute(
        'UPDATE images_image SET region_count = ('
            'SELECT COUNT(*) FROM editor_imageregion '
            'WHERE editor_imageregion.image_id = images_image.id'
        ') '
        'WHERE id = %s', [instance.image_id])
    cursor.execute(
        'UPDATE hierarchy_hierarchy SET region_count = ('
            'SELECT COUNT(*) FROM editor_imageregion '
            'WHERE editor_imageregion.tag_id = hierarchy_hierarchy.id'
        ') '
        'WHERE id = %s', [instance.tag_id])

post_save.connect(update_region_count, sender=ImageRegion)
post_delete.connect(update_region_count, sender=ImageRegion)
