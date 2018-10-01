from django.conf import settings
from rest_framework.views import APIView
from rest_framework import generics

from .models import ImageRegion
from .serializers import ImageRegionSerializer

class ImageRegionList(generics.CreateAPIView):
    queryset = ImageRegion.objects.all()
    serializer_class = ImageRegionSerializer
    pagination_class = None
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ImageRegionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = ImageRegion.objects.all()
    serializer_class = ImageRegionSerializer
