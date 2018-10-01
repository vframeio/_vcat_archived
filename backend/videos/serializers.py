from rest_framework import serializers
from .models import Video

class VideoSerializer(serializers.ModelSerializer):
  class Meta:
    model = Video
    fields = (
      'id',
      'reference_code',
      'url',
      'thumbnail',
      'graphic_content',
      'name_en',
      'name_ar',
      'location',
      'date',
      'time',
      'weapon_tag',
      'collection_tag',
      'violation_tag',
      'status',
      'reviewed_by',
      'reviewed_date',
      'created_at',
      'updated_at',
    )
