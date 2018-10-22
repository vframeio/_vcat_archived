from rest_framework import serializers
from .models import Image, ImageGroup
from django.contrib.auth.models import User, Group
from backend.api.serializers import UserSerializer
from backend.editor.serializers import ImageRegionSerializer
from backend.editor.models import ImageRegion

from urllib.parse import urlsplit

class NewImageRegionSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = ImageRegion
        fields = (
            'id', 'user',
            'image', 'tag', 'x', 'y', 'width', 'height',
            'created_at', 'updated_at',
        )

class HierarchyImageRegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageRegion
        fields = (
            'id', 'user',
            'tag', 'x', 'y', 'width', 'height',
        )

class ImageSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    regions = NewImageRegionSerializer(many=True, read_only=True)
    class Meta:
        model = Image
        fields = (
            'id', 'user',
            'fn', 'ext',
            'original_fn',
            'from_sa', 'source_url', 'sa_hash', 'verified',
            'graphic', 'uploaded', 'regions', 'tags', 'description',
            'region_count', 'phash', 'base_href', 'frame',
            'image_group', 'complete',
            'created_at', 'updated_at',
        )

class HierarchyImageSerializer(serializers.ModelSerializer):
    regions = HierarchyImageRegionSerializer(many=True, read_only=True)
    class Meta:
        model = Image
        fields = (
            'id', 'user',
            'fn', 'ext',
            'original_fn',
            'from_sa', 'source_url', 'sa_hash', 'verified',
            'graphic', 'uploaded', 'regions', 'tags', 'description',
            'region_count', 'phash', 'base_href', 'frame',
            'image_group', 'complete',
            'created_at', 'updated_at',
        )

class ImageSerializerForGroups(serializers.ModelSerializer):
    regions = NewImageRegionSerializer(many=True, read_only=True)
    class Meta:
        model = Image
        fields = (
            'id',
            'fn', 'ext',
            'original_fn',
            'from_sa', 'source_url', 'sa_hash', 'verified',
            'graphic', 'uploaded', 'regions', 'tags', 'description',
            'base_href', 'frame',
            'region_count', 'phash',
            'image_group', 'complete',
            'created_at', 'updated_at',
        )

class SavedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = (
            'id', 'user',
            'fn', 'ext',
            'original_fn',
            'from_sa', 'source_url', 'sa_hash', 'verified',
            'graphic', 'uploaded', 'tags', 'description',
            'base_href', 'frame',
            'region_count', 'phash',
            'image_group', 'complete',
            'created_at', 'updated_at',
        )

class UpdateImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = (
            'fn', 'ext',
            'original_fn',
            'base_href', 'frame',
            'from_sa', 'source_url', 'sa_hash', 'verified',
            'graphic', 'uploaded', 'tags', 'description',
            'region_count', 'phash', 'complete',
            'created_at', 'updated_at',
        )

class ImageSearchSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    user = serializers.CharField()
    fn = serializers.CharField()
    ext = serializers.CharField()
    original_fn = serializers.CharField()
    source_url = serializers.CharField()
    sa_hash = serializers.CharField()
    frame = serializers.CharField()
    verified = serializers.BooleanField()
    graphic = serializers.BooleanField()
    uploaded = serializers.BooleanField()
    tags = serializers.CharField()
    description = serializers.CharField()
    region_count = serializers.IntegerField()
    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()
    hamming_distance = serializers.IntegerField()

class QuickImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = (
            'id',
            'fn', 'ext',
            'sa_hash', 'verified', 'frame',
            'from_sa', 'uploaded', 'source_url',
            'graphic',
            'region_count',
        )

######################################

class ImageGroupSerializer(serializers.ModelSerializer):
    # assigned_to = UserSerializer()
    # assigned_to = serializers.PrimaryKeyRelatedField(allow_null=True)
    images = ImageSerializerForGroups(many=True, read_only=True)
    class Meta:
        model = ImageGroup
        fields = (
            'id', 'assigned_to',
            'from_sa', 'source_url', 'sa_hash',
            'images', 'complete',
            'created_at', 'updated_at',
        )

class ImageGroupItemSerializer(serializers.ModelSerializer):
    assigned_to = serializers.PrimaryKeyRelatedField(many=False, allow_null=True, queryset=User.objects.all())
    class Meta:
        model = ImageGroup
        fields = (
            'id', 'assigned_to',
            'from_sa', 'source_url', 'sa_hash',
            'complete',
            'created_at', 'updated_at',
        )

class SavedImageGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageGroup
        fields = (
            'id', 'from_sa', 'source_url', 'sa_hash',
        )

    def create(self, attrs, instance=None):
        if attrs.get('image_group_id'):
            image_group = ImageGroup.objects.get(id=attrs.get('image_group_id'))
        elif attrs.get('from_sa'):
            (image_group, created) = ImageGroup.objects.get_or_create(
                from_sa=attrs.get('from_sa'),
                sa_hash=attrs.get('sa_hash').lower()
            )
        else:
            url = attrs.get('source_url')
            if url.startswith('http'):
                url = "{0.netloc}".format(urlsplit(url))

            (image_group, created) = ImageGroup.objects.get_or_create(
                from_sa=attrs.get('from_sa'),
                source_url=url
            )

        return image_group
