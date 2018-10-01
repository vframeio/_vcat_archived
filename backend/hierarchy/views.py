from django.conf import settings
from django.http import Http404, HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
from rest_framework import status, generics

from backend.hierarchy.models import Hierarchy
from backend.hierarchy.serializers import HierarchySerializer, \
    HierarchyItemSerializer, HierarchyDetailSerializer, \
    HierarchyFullSerializer, HierarchyRegionSerializer

import uuid
from subprocess import call
import os

class HierarchyList(generics.ListAPIView):
    queryset = Hierarchy.objects.all()
    serializer_class = HierarchySerializer
    pagination_class = None

class HierarchyCreate(generics.CreateAPIView):
    queryset = Hierarchy.objects.all()
    serializer_class = HierarchyItemSerializer
    pagination_class = None

class HierarchyDetail(generics.RetrieveAPIView):
    queryset = Hierarchy.objects.all()
    serializer_class = HierarchyDetailSerializer

class HierarchyFull(generics.ListAPIView):
    queryset = Hierarchy.objects.all()
    serializer_class = HierarchyFullSerializer

class HierarchyFullDetail(generics.RetrieveAPIView):
    queryset = Hierarchy.objects.all()
    serializer_class = HierarchyFullSerializer

class HierarchyRegionDetail(generics.RetrieveAPIView):
    queryset = Hierarchy.objects.all()
    serializer_class = HierarchyRegionSerializer

class HierarchyUpdate(generics.UpdateAPIView):
    queryset = Hierarchy.objects.all()
    serializer_class = HierarchyItemSerializer

class HierarchyDestroy(generics.DestroyAPIView):
    queryset = Hierarchy.objects.all()
    serializer_class = HierarchyItemSerializer
