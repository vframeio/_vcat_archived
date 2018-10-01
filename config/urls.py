from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import include, url
from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView
from rest_framework.authtoken import views as drf_views

from django.urls import re_path
from django.views.static import serve
from .views import IndexView

app_name = 'config'

# first: url patterns for all apps
urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^api-token-auth/', drf_views.obtain_auth_token, name='auth'),
    url(r'^api/', include('backend.api.urls')),
    url(r'^invitations/', include('invitations.urls', namespace='invitations')),
]

# next: dev endpoint to serve uploaded media
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# last: universal index page
urlpatterns += [
  url(r'^', include('favicon.urls')),
  url(r'^', IndexView.as_view()),
]