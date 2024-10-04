from django.urls import path, re_path
from .views import getPageOfOrders
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
  re_path(r'^orders/?$', getPageOfOrders, name='getPageOfOrders')
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)