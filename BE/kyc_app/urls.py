from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import CountryMasterViewSet, OfficeMasterViewSet

router = DefaultRouter()
router.register(r'countries', CountryMasterViewSet, basename='countrymaster')
router.register(r'offices', OfficeMasterViewSet, basename='officemaster')

urlpatterns = [
    path('api/', include(router.urls)),
]
