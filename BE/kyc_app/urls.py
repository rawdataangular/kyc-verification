from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import (
    CountryMasterViewSet, OfficeMasterViewSet, 
    UserTypeMasterViewSet, DocumentTypeMasterViewSet
)

router = DefaultRouter()
router.register(r'countries', CountryMasterViewSet, basename='countrymaster')
router.register(r'offices', OfficeMasterViewSet, basename='officemaster')
router.register(r'user-types', UserTypeMasterViewSet, basename='usertypemaster')
router.register(r'document-types', DocumentTypeMasterViewSet, basename='documenttypemaster')

urlpatterns = [
    path('api/', include(router.urls)),
]
