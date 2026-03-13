from rest_framework import viewsets
from .models import CountryMaster, OfficeMaster, UserTypeMaster
from .serializers import CountryMasterSerializer, OfficeMasterSerializer, UserTypeMasterSerializer

class CountryMasterViewSet(viewsets.ModelViewSet):
    queryset = CountryMaster.objects.all()
    serializer_class = CountryMasterSerializer

class OfficeMasterViewSet(viewsets.ModelViewSet):
    queryset = OfficeMaster.objects.all()
    serializer_class = OfficeMasterSerializer

class UserTypeMasterViewSet(viewsets.ModelViewSet):
    queryset = UserTypeMaster.objects.all()
    serializer_class = UserTypeMasterSerializer
