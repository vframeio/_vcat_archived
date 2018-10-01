from django.views.generic.base import TemplateView
from django.utils.safestring import SafeString
from django.conf import settings
import json

class IndexView(TemplateView):
    template_name = "index.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['site_info'] = SafeString(json.dumps({
          'client_name': settings.SITE_CLIENT,
          'client_short': settings.SITE_CLIENT_SHORT,
          'storage': settings.FILE_STORAGE,
          's3': {
            'region': settings.S3['region'],
            'bucket': settings.S3['bucket'],
          }
        }))
        return context
