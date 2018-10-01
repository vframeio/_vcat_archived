from django.conf.urls import url, include
from rest_framework import routers
from backend.api import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^hierarchy/', include('backend.hierarchy.urls')),
    url(r'^videos/', include('backend.videos.urls')),
    url(r'^images/', include('backend.images.urls')),
    url(r'^editor/', include('backend.editor.urls')),
    url(r'^metadata/', include('backend.vsearch.urls')),
]
