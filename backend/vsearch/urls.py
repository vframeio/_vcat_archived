from django.conf.urls import url
from django.http import JsonResponse
from . import views

urlpatterns = [
    url(r'^md5/(?P<md5>[0-9a-f]+)/?$', views.ShaLookupDetail),
    url(r'^(?P<sha256>[0-9a-f]+)/(?P<tag>[0-9a-z_]+)/?$', views.DocumentDetail),
    url(r'^(?P<sha256>[0-9a-f]+)/?$', views.DocumentList),
]
