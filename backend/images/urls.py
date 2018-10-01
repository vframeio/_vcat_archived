from django.conf.urls import url
from backend.images import views, stats, import_

urlpatterns = [
    url(r'^import/search/', import_.SearchView.as_view()),
    url(r'^import/new/', import_.ImportView.as_view()),

    url(r'^stats/', stats.ImageStats.as_view()),

    url(r'^group/new/?$', views.ImageGroupCreate.as_view()),
    url(r'^group/edit/(?P<pk>[0-9]+)/?$', views.ImageGroupUpdate.as_view()),
    url(r'^group/show/(?P<pk>[0-9]+)/?$', views.ImageGroupDetail.as_view()),
    # url(r'^group/assigned/?$', views.ImageGroupAssigned.as_view()),
    url(r'^group/?$', views.ImageGroupList.as_view()),
    url(r'^new/?$', views.ImageUpload.as_view()),
    url(r'^edit/(?P<pk>[0-9]+)/?$', views.ImageUpdate.as_view()),
    url(r'^show/(?P<pk>[0-9]+)/?$', views.ImageDetail.as_view()),
    url(r'^user/?$', views.UserImageList.as_view()),
    url(r'^user/annotated/?$', views.AnnotatedUserImageList.as_view()),
    url(r'^user/nonannotated/?$', views.NonannotatedUserImageList.as_view()),
    url(r'^search/?$', views.ImageSearch.as_view()),
    url(r'^$', views.ImageList.as_view()),
]
