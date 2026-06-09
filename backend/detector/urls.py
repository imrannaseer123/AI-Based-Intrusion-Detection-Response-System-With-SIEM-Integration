from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LogViewSet, AlertViewSet, detect_view, send_to_splunk_view, health_view

router = DefaultRouter()
router.register(r'logs', LogViewSet)
router.register(r'alerts', AlertViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('detect/', detect_view, name='detect'),
    path('send-to-splunk/', send_to_splunk_view, name='send_to_splunk'),
    path('health/', health_view, name='health'),
]
