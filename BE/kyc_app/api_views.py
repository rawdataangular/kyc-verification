from rest_framework import viewsets
from .models import CountryMaster
from .serializers import CountryMasterSerializer

class CountryMasterViewSet(viewsets.ModelViewSet):
    queryset = CountryMaster.objects.all()
    serializer_class = CountryMasterSerializer
