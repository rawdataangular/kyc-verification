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

class UserDocumentSerializer(serializers.ModelSerializer):
    document_type_name = serializers.CharField(source='document_requirement.document_type.name', read_only=True)
    is_mandatory = serializers.BooleanField(source='document_requirement.is_mandatory', read_only=True)

    class Meta:
        model = UserDocument
        fields = [
            'id', 'user_detail', 'document_requirement', 'document_type_name', 
            'is_mandatory', 'document_value', 'file_upload', 'is_active', 
            'uploaded_at', 'verification_status', 'verification_method', 
            'is_verified', 'verified_at', 'verified_by'
        ]

class UserDetailSerializer(serializers.ModelSerializer):
    country_name = serializers.CharField(source='country.name', read_only=True)
    office_name = serializers.CharField(source='office.name', read_only=True)
    user_type_name = serializers.CharField(source='user_type.name', read_only=True)
    kyc_summary = serializers.SerializerMethodField()
    documents = UserDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = UserDetail
        fields = [
            'id', 'name', 'country', 'country_name', 'office', 'office_name', 
            'user_type', 'user_type_name', 'status', 'state', 'city', 
            'remarks', 'person1_name', 'person1_phone', 'person2_name', 
            'person2_phone', 'full_address', 'bank_name', 'account_holder_name', 
            'account_number', 'ifsc_swift', 'kyc_summary', 'documents'
        ]

    def get_kyc_summary(self, obj):
        try:
            from .models import DocumentRequirement
            required_count = DocumentRequirement.objects.filter(
                user_type=obj.user_type,
                country=obj.country,
                office=obj.office
            ).count()
            
            uploaded_docs = obj.documents.filter(is_active=True)
            accepted_count = uploaded_docs.filter(verification_status='VERIFIED').count()
            rejected_count = uploaded_docs.filter(verification_status='REJECTED').count()
            pending_count = uploaded_docs.filter(verification_status='PENDING').count()

            return {
                'required': required_count,
                'accepted': accepted_count,
                'rejected': rejected_count,
                'pending': pending_count
            }
        except:
            return {'required': 0, 'accepted': 0, 'rejected': 0, 'pending': 0}
