from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import (
    CountryMasterViewSet, OfficeMasterViewSet, 
    UserTypeMasterViewSet, DocumentTypeMasterViewSet,
    DocumentRequirementViewSet, UserDetailViewSet, UserDocumentViewSet
)

router = DefaultRouter()
router.register(r'countries', CountryMasterViewSet, basename='countrymaster')
router.register(r'offices', OfficeMasterViewSet, basename='officemaster')
router.register(r'user-types', UserTypeMasterViewSet, basename='usertypemaster')
router.register(r'document-types', DocumentTypeMasterViewSet, basename='documenttypemaster')
router.register(r'requirement-matrix', DocumentRequirementViewSet, basename='documentrequirement')
router.register(r'user-details', UserDetailViewSet, basename='userdetail')
router.register(r'user-documents', UserDocumentViewSet, basename='userdocument')

urlpatterns = [
    path('api/', include(router.urls)),
]
