from django.contrib import admin
from .models import (
    MasterUser, CountryMaster, OfficeMaster, UserTypeMaster,
    DocumentRequirement, UserDetail, UserDocument
)

@admin.register(UserTypeMaster)
class UserTypeMasterAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(MasterUser)
class MasterUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'created_at')
    search_fields = ('username',)

@admin.register(CountryMaster)
class CountryMasterAdmin(admin.ModelAdmin):
    list_display = ('name', 'code_2', 'code_3', 'dial_code')
    search_fields = ('name', 'code_2', 'code_3')

@admin.register(OfficeMaster)
class OfficeMasterAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'contact', 'email')
    list_filter = ('country',)
    search_fields = ('name',)

@admin.register(DocumentRequirement)
class DocumentRequirementAdmin(admin.ModelAdmin):
    list_display = ('document_name', 'user_type', 'country', 'office', 'is_mandatory')
    list_filter = ('user_type', 'country', 'office', 'is_mandatory')
    search_fields = ('document_name',)

class UserDocumentInline(admin.TabularInline):
    model = UserDocument
    extra = 1
    fields = ('document_requirement', 'file_upload', 'document_value', 'is_active')

@admin.register(UserDetail)
class UserDetailAdmin(admin.ModelAdmin):
    list_display = ('name', 'user_type', 'country', 'office', 'status', 'created_at')
    list_filter = ('user_type', 'status', 'country', 'office')
    search_fields = ('name', 'bank_name', 'account_number')
    inlines = [UserDocumentInline]
    
    # Organize fields in Fieldsets for readability
    fieldsets = (
        ('Basic Information', {
            'fields': ('master_user', 'name', 'user_type', 'status', 'remarks')
        }),
        ('Location Details', {
            'fields': ('country', 'state', 'city', 'office')
        }),
        ('Contact Information', {
            'fields': ('person1_name', 'person1_phone', 'person2_name', 'person2_phone', 'full_address')
        }),
        ('Banking Information', {
            'fields': ('bank_name', 'account_holder_name', 'account_number', 'ifsc_swift')
        }),
    )

@admin.register(UserDocument)
class UserDocumentAdmin(admin.ModelAdmin):
    list_display = ('user_detail', 'document_requirement', 'is_active', 'uploaded_at')
    list_filter = ('is_active', 'uploaded_at')
    search_fields = ('user_detail__name', 'document_requirement__document_name')
