import os
from django.db import models
from django.core.validators import FileExtensionValidator

def user_document_path(instance, filename):
    """
    Constructs the file path: country/office/customer_name/document_names
    Handles both active and archived documents.
    """
    try:
        country_name = instance.user_detail.country.name.replace(' ', '_').lower()
        office_name = instance.user_detail.office.name.replace(' ', '_').lower()
        customer_name = instance.user_detail.name.replace(' ', '_').lower()
        # Clean doc name for folder use from the linked DocumentTypeMaster
        doc_name = instance.document_requirement.document_type.name.replace(' ', '_').lower()
        
        # 'active' vs 'archive' folder
        status_folder = 'active' if instance.is_active else 'archive'
        
        # Final structure: documents/india/mumbai_office/customer_xyz/active/gst_number.pdf
        return f'documents/{country_name}/{office_name}/{customer_name}/{status_folder}/{doc_name}_{filename}'
    except Exception:
        # Fallback path if any ForeignKey doesn't resolve (rare in valid DB state)
        return f'documents/unsorted/{filename}'

class MasterUser(models.Model):
    """Master Data: Just the basic user record for identification"""
    username = models.CharField(max_length=255, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username

class CountryMaster(models.Model):
    name = models.CharField(max_length=150, unique=True)
    code_2 = models.CharField(max_length=10, verbose_name="2-Letter Code", blank=True, null=True)
    code_3 = models.CharField(max_length=10, verbose_name="3-Letter Code", blank=True, null=True)
    dial_code = models.CharField(max_length=20, verbose_name="Dial Code", blank=True, null=True)
    
    class Meta:
        verbose_name_plural = "Countries"

    def __str__(self):
        return f"{self.name} (+{self.dial_code})"

class OfficeMaster(models.Model):
    name = models.CharField(max_length=255)
    country = models.ForeignKey(CountryMaster, on_delete=models.CASCADE, related_name='offices', null=True, blank=True)
    address = models.TextField()
    contact = models.CharField(max_length=50)
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.country.name})"

class UserTypeMaster(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "User Type"
        verbose_name_plural = "User Types"

    def __str__(self):
        return self.name

class DocumentTypeMaster(models.Model):
    """New Table: Declaration of document names and descriptions"""
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Document Type"
        verbose_name_plural = "Document Types"

    def __str__(self):
        return self.name

class KYCStatusChoices(models.TextChoices):
    DRAFT = 'DRAFT', 'Draft'
    KYC_PENDING = 'KYC_PENDING', 'KYC Pending'
    PENDING_APPROVAL = 'PENDING_APPROVAL', 'KYC Approval Pending'
    APPROVED = 'APPROVED', 'Approved'
    REJECTED = 'REJECTED', 'Rejected'
    EXPIRED = 'EXPIRED', 'KYC Expiry'
    INACTIVE = 'INACTIVE', 'Inactive'

class DocumentRequirement(models.Model):
    """Configuration: Maps mandatory documents per Type/Country/Office"""
    user_type = models.ForeignKey(UserTypeMaster, on_delete=models.CASCADE, related_name='requirements')
    country = models.ForeignKey(CountryMaster, on_delete=models.CASCADE)
    office = models.ForeignKey(OfficeMaster, on_delete=models.CASCADE)
    # Refactored to link to DocumentTypeMaster
    document_type = models.ForeignKey(DocumentTypeMaster, on_delete=models.CASCADE, related_name='mapped_requirements', null=True, blank=True)
    is_mandatory = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user_type', 'country', 'office', 'document_type')
        indexes = [models.Index(fields=['user_type', 'country', 'office'])]

    def __str__(self):
        return f"{self.user_type.name} - {self.document_type.name} ({self.country.name})"

class UserDetail(models.Model):
    """Main User Profile: Mirrors logic sheet with details and stats"""
    # Basic Info
    master_user = models.OneToOneField(MasterUser, on_delete=models.CASCADE, related_name='profile', null=True, blank=True)
    name = models.CharField(max_length=255, db_index=True)
    country = models.ForeignKey(CountryMaster, on_delete=models.PROTECT)
    state = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    office = models.ForeignKey(OfficeMaster, on_delete=models.PROTECT)
    user_type = models.ForeignKey(UserTypeMaster, on_delete=models.PROTECT, related_name='profiles')
    remarks = models.TextField(blank=True, null=True)
    
    # Status/Stats tracking
    status = models.CharField(
        max_length=30, 
        choices=KYCStatusChoices.choices, 
        default=KYCStatusChoices.DRAFT,
        db_index=True
    )
    
    # Contact Sections
    person1_name = models.CharField(max_length=255)
    person1_phone = models.CharField(max_length=20)
    person2_name = models.CharField(max_length=255, blank=True, null=True)
    person2_phone = models.CharField(max_length=20, blank=True, null=True)
    full_address = models.TextField()

    # Banking Sections
    bank_name = models.CharField(max_length=255, blank=True, null=True)
    account_holder_name = models.CharField(max_length=255, blank=True, null=True)
    account_number = models.CharField(max_length=50, blank=True, null=True)
    ifsc_swift = models.CharField(max_length=20, blank=True, null=True)

    # Auditing
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.status}"

class UserDocument(models.Model):
    """Stores the actual uploads and values provided by the user"""
    user_detail = models.ForeignKey(UserDetail, on_delete=models.CASCADE, related_name='documents')
    document_requirement = models.ForeignKey(DocumentRequirement, on_delete=models.PROTECT)
    document_value = models.CharField(max_length=255, blank=True, null=True, help_text="ID/Number from the doc")
    file_upload = models.FileField(
        upload_to=user_document_path,
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'jpg', 'jpeg', 'png'])]
    )
    is_active = models.BooleanField(default=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    # Verification details
    verification_status = models.CharField(
        max_length=30,
        choices=[
            ('PENDING', 'Pending'),
            ('VERIFIED', 'Verified'),
            ('REJECTED', 'Rejected'),
        ],
        default='PENDING'
    )
    verification_method = models.CharField(
        max_length=30,
        choices=[
            ('MANUAL', 'Manual'),
            ('PORTAL', 'Via Portal'),
        ],
        blank=True,
        null=True
    )
    is_verified = models.BooleanField(default=False)
    verified_at = models.DateTimeField(null=True, blank=True)
    verified_by = models.ForeignKey(MasterUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_docs')

    class Meta:
        indexes = [models.Index(fields=['user_detail', 'is_active'])]

    def __str__(self):
        return f"{self.user_detail.name} | {self.document_requirement.document_type.name}"
