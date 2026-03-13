from rest_framework import viewsets
from .models import CountryMaster, OfficeMaster
from .serializers import CountryMasterSerializer, OfficeMasterSerializer

class CountryMasterViewSet(viewsets.ModelViewSet):
    queryset = CountryMaster.objects.all()
    serializer_class = CountryMasterSerializer

class OfficeMasterViewSet(viewsets.ModelViewSet):
    queryset = OfficeMaster.objects.all()
    serializer_class = OfficeMasterSerializer
