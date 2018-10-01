from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from backend.images.models import Image
from backend.editor.models import ImageRegion

import datetime

class Hierarchy(models.Model):
  parent = models.ForeignKey('self', related_name='child_set', null=True, on_delete=models.CASCADE)
  image = models.ForeignKey(Image, null=True, blank=True, on_delete=models.SET_NULL)
  name = models.CharField(max_length=80, blank=True)
  display_name = models.CharField(max_length=80, blank=True)
  slug = models.CharField(max_length=80)
  category = models.CharField(max_length=80, blank=True)
  path = models.CharField(max_length=200, blank=True)
  synonyms = models.CharField(max_length=200, blank=True)
  is_attribute = models.BooleanField(default=False)
  region_count = models.IntegerField(default=0)
  description = models.TextField(blank=True)
  created_at = models.DateTimeField(auto_now_add=True, blank=True)
  updated_at = models.DateTimeField(auto_now=True, blank=True)

  images = models.ManyToManyField('images.Image', through='editor.ImageRegion', related_name='images')

  class Meta:
    ordering = ('id',)

  def __str__(self):
      return "{}:{}".format(self.category, self.slug)
