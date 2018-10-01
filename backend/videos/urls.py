from django.conf.urls import url, include
from backend.videos import views

urlpatterns = [
    url(r'^(?P<pk>[0-9]+)/$', views.VideoDetail.as_view()),
    url(r'^$', views.VideoList.as_view()),
]