from rest_framework import serializers
from .models import ImageRegion

class ImageRegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageRegion
        fields = ('id', 'image', 'tag', 'x', 'y', 'width', 'height', 't')
