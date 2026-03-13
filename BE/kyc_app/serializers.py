from rest_framework import serializers
from .models import CountryMaster

class CountryMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CountryMaster
        fields = '__all__'
