from django.conf.urls import url
from backend.editor import views

urlpatterns = [
    url(r'^image/region/(?P<pk>[0-9]+)/?$', views.ImageRegionDetail.as_view()),
    url(r'^image/region/?$', views.ImageRegionList.as_view()),
]
