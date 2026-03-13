from rest_framework import viewsets
from .models import CountryMaster, OfficeMaster, UserTypeMaster, DocumentTypeMaster, DocumentRequirement, UserDetail, UserDocument
from .serializers import (
    CountryMasterSerializer, OfficeMasterSerializer, 
    UserTypeMasterSerializer, DocumentTypeMasterSerializer,
    DocumentRequirementSerializer, UserDetailSerializer, UserDocumentSerializer
)

class CountryMasterViewSet(viewsets.ModelViewSet):
    queryset = CountryMaster.objects.all()
    serializer_class = CountryMasterSerializer

class OfficeMasterViewSet(viewsets.ModelViewSet):
    queryset = OfficeMaster.objects.all()
    serializer_class = OfficeMasterSerializer

class UserTypeMasterViewSet(viewsets.ModelViewSet):
    queryset = UserTypeMaster.objects.all()
    serializer_class = UserTypeMasterSerializer

class DocumentTypeMasterViewSet(viewsets.ModelViewSet):
    queryset = DocumentTypeMaster.objects.all()
    serializer_class = DocumentTypeMasterSerializer

class DocumentRequirementViewSet(viewsets.ModelViewSet):
    queryset = DocumentRequirement.objects.all()
    serializer_class = DocumentRequirementSerializer
    filterset_fields = ['user_type', 'country', 'office', 'is_mandatory']

class UserDetailViewSet(viewsets.ModelViewSet):
    queryset = UserDetail.objects.all()
    serializer_class = UserDetailSerializer
    filterset_fields = ['status', 'user_type', 'country', 'office']

class UserDocumentViewSet(viewsets.ModelViewSet):
    queryset = UserDocument.objects.all()
    serializer_class = UserDocumentSerializer
    filterset_fields = ['user_detail', 'is_active']
