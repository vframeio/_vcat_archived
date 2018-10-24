from rest_framework import serializers
from django.db import models
from .models import Hierarchy
from backend.images.serializers import HierarchyImageSerializer, QuickImageSerializer
from backend.editor.serializers import ImageRegionSerializer

class HierarchyFullSerializer(serializers.ModelSerializer):
    images = HierarchyImageSerializer(many=True, read_only=True)
    class Meta:
        model = Hierarchy
        fields = (
            'id', 'parent', 'name', 'display_name',
            'slug', 'category', 'path', 'synonyms',
            'is_attribute',
            'description', 'image', 'images',
        )

class HierarchyRegionSerializer(serializers.ModelSerializer):
    image = QuickImageSerializer(read_only=True)
    images = QuickImageSerializer(many=True, read_only=True)
    regions = ImageRegionSerializer(many=True, read_only=True)
    class Meta:
        model = Hierarchy
        fields = (
            'id', 'parent', 'name', 'display_name',
            'slug', 'category', 'path', 'synonyms',
            'is_attribute',
            'description', 'image', 'images', 'regions',
        )

class HierarchyDetailSerializer(serializers.ModelSerializer):
    image = QuickImageSerializer(read_only=True)
    images = QuickImageSerializer(many=True, read_only=True)
    class Meta:
        model = Hierarchy
        fields = (
            'id', 'parent', 'name', 'display_name',
            'slug', 'category', 'path', 'synonyms',
            'is_attribute',
            'description', 'image', 'images',
        )

class HierarchyItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hierarchy
        fields = (
            'id', 'parent', 'name', 'display_name',
            'slug', 'category', 'path', 'synonyms',
            'is_attribute',
            'description', 'image',
        )

class HierarchySerializer(serializers.ModelSerializer):
    image = QuickImageSerializer()
    class Meta:
        model = Hierarchy
        fields = (
            'id', 'parent', 'name', 'display_name',
            'slug', 'category', 'path', 'synonyms',
            'is_attribute', 'region_count',
            'description', 'image',
        )
