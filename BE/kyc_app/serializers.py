from rest_framework import serializers
from .models import CountryMaster, OfficeMaster, UserTypeMaster, DocumentTypeMaster, DocumentRequirement, UserDetail, UserDocument

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

class DocumentTypeMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentTypeMaster
        fields = '__all__'

class DocumentRequirementSerializer(serializers.ModelSerializer):
    user_type_name = serializers.CharField(source='user_type.name', read_only=True)
    country_name = serializers.CharField(source='country.name', read_only=True)
    office_name = serializers.CharField(source='office.name', read_only=True)
    document_type_name = serializers.CharField(source='document_type.name', read_only=True)

    class Meta:
        model = DocumentRequirement
        fields = [
            'id', 'user_type', 'user_type_name', 
            'country', 'country_name', 
            'office', 'office_name', 
            'document_type', 'document_type_name', 
            'is_mandatory'
        ]

class UserDetailSerializer(serializers.ModelSerializer):
    country_name = serializers.CharField(source='country.name', read_only=True)
    office_name = serializers.CharField(source='office.name', read_only=True)
    user_type_name = serializers.CharField(source='user_type.name', read_only=True)

    class Meta:
        model = UserDetail
        fields = '__all__'

class UserDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDocument
        fields = '__all__'
