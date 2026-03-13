from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import CountryMasterViewSet

router = DefaultRouter()
router.register(r'countries', CountryMasterViewSet, basename='countrymaster')

urlpatterns = [
    path('api/', include(router.urls)),
]
