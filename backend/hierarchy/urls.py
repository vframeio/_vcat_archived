from django.conf.urls import url
from backend.hierarchy import views

urlpatterns = [
    url(r'^new/?$', views.HierarchyCreate.as_view()),
    url(r'^full/?$', views.HierarchyFull.as_view()),
    url(r'^(?P<pk>[0-9]+)/full/?$', views.HierarchyFullDetail.as_view()),
    url(r'^(?P<pk>[0-9]+)/regions/?$', views.HierarchyRegionDetail.as_view()),
    url(r'^(?P<pk>[0-9]+)/update/?$', views.HierarchyUpdate.as_view()),
    url(r'^(?P<pk>[0-9]+)/destroy/?$', views.HierarchyDestroy.as_view()),
    url(r'^(?P<pk>[0-9]+)/?$', views.HierarchyDetail.as_view()),
    url(r'^$', views.HierarchyList.as_view()),
]
