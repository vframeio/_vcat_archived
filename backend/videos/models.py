from django.db import models
from django.utils import timezone
# from backend.hierarchy.models import Hierarchy
import datetime

VIDEO_STATUS = [
  "Pending",
  "Complete",
  "Reviewed",
]

class Video(models.Model):
  reference_code = models.CharField(max_length=32)
  url = models.TextField(max_length=512)
  thumbnail = models.CharField(max_length=256)
  graphic_content = models.BooleanField()
  name_en = models.CharField(max_length=256)
  name_ar = models.CharField(max_length=256)
  date = models.CharField(max_length=16)
  time = models.CharField(max_length=16)
  location = models.CharField(max_length=256)
  # only storing one each for now...
  # weapon_tag = models.ForeignKey(Hierarchy, null=True, on_delete=models.CASCADE, related_name='+')
  # collection_tag = models.ForeignKey(Hierarchy, null=True, on_delete=models.CASCADE, related_name='+')
  # violation_tag = models.ForeignKey(Hierarchy, null=True, on_delete=models.CASCADE, related_name='+')
  status = models.IntegerField(default=0)
  reviewed_by = models.CharField(max_length=16, null=True)
  reviewed_date = models.DateTimeField(null=True)
  created_at = models.DateTimeField(auto_now_add=True, blank=True)
  updated_at = models.DateTimeField(auto_now=True, blank=True)

  class Meta:
    ordering = ('id',)

  def __str__(self):
      return "{}".format(self.reference_code)
