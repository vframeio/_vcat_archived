from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
import datetime

class ImageGroup(models.Model):
  assigned_to = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
  from_sa = models.BooleanField(default=False)
  sa_hash = models.CharField(max_length=80, blank=True)
  source_url = models.CharField(max_length=200, default="", blank=True)
  description = models.TextField(blank=True, default="")
  complete = models.BooleanField(default=False)
  created_at = models.DateTimeField(auto_now_add=True, blank=True)
  updated_at = models.DateTimeField(auto_now=True, blank=True)

  class Meta:
    ordering = ('id',)

class Image(models.Model):
  image_group = models.ForeignKey(ImageGroup, related_name='images', null=True, on_delete=models.CASCADE)
  user = models.ForeignKey(User, related_name='image', null=True, on_delete=models.SET_NULL)
  fn = models.CharField(max_length=80)
  ext = models.CharField(max_length=4, blank=True)
  original_fn = models.CharField(max_length=80, blank=True)
  from_sa = models.BooleanField(default=False)
  sa_hash = models.CharField(max_length=80, blank=True)
  base_href = models.CharField(max_length=90, blank=True)
  frame = models.CharField(max_length=6, blank=True)
  verified = models.BooleanField(blank=True)
  source_url = models.CharField(max_length=200, default="", blank=True)
  width = models.IntegerField(default=0)
  height = models.IntegerField(default=0)
  graphic = models.BooleanField(default=False)
  uploaded = models.BooleanField(default=False)
  tags = models.CharField(max_length=512, blank=True, default="")
  description = models.TextField(blank=True, default="")
  phash = models.BigIntegerField(blank=True)
  created_at = models.DateTimeField(auto_now_add=True, blank=True)
  updated_at = models.DateTimeField(auto_now=True, blank=True)
  region_count = models.IntegerField(default=0)
  complete = models.BooleanField(default=False)

  class Meta:
    ordering = ('id',)

  def __str__(self):
      return "/uploads/{}/{}{}".format(self.id, self.fn, self.ext)
