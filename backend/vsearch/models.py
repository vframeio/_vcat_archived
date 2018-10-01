from django.db import models

class DocumentTag(models.Model):
  name = models.CharField(max_length=256, blank=True)

class Document(models.Model):
  tag = models.ForeignKey(DocumentTag, db_index=True, on_delete=models.CASCADE)
  sha256 = models.CharField(max_length=64, db_index=True)
  data = models.TextField()

class ShaLookup(models.Model):
  md5 = models.CharField(max_length=32, db_index=True)
  sha256 = models.CharField(max_length=64)
