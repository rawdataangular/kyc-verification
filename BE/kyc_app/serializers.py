from rest_framework import serializers
from .models import CountryMaster, OfficeMaster, UserTypeMaster

class CountryMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CountryMaster
        fields = '__all__'

class OfficeMasterSerializer(serializers.ModelSerializer):
    country_name = serializers.CharField(source='country.name', read_only=True)
    
    class Meta:
        model = OfficeMaster
        fields = ['id', 'name', 'country', 'country_name', 'address', 'contact', 'email']

class UserTypeMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTypeMaster
        fields = '__all__'
