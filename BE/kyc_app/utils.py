from django.db import transaction
from .models import UserDetail, UserDocument, DocumentRequirement, KYCStatusChoices

def get_full_user_profile(user_detail_id):
    """
    Optimized retrieval: Fetches profile with related master data 
    and all active documents in 2 DB queries using select_related/prefetch_related.
    """
    try:
        profile = UserDetail.objects.select_related(
            'master_user', 'country', 'office'
        ).prefetch_related(
            'documents__document_requirement'
        ).get(id=user_detail_id)
        
        # Filter active documents locally to avoid N+1 queries
        active_docs = [doc for doc in profile.documents.all() if doc.is_active]
        return profile, active_docs
    except UserDetail.DoesNotExist:
        return None, []

@transaction.atomic
def upload_user_document(user_detail, requirement_id, file, doc_value=None):
    """
    Optimized Storage Logic:
    1. Archives existing active document of the same type.
    2. Stores new document.
    3. Handles everything inside an atomic transaction.
    """
    try:
        requirement = DocumentRequirement.objects.get(id=requirement_id)
        
        # Bulk archive existing active docs of this type for this user
        UserDocument.objects.filter(
            user_detail=user_detail,
            document_requirement=requirement,
            is_active=True
        ).update(is_active=False)
        
        # Create new record
        new_doc = UserDocument.objects.create(
            user_detail=user_detail,
            document_requirement=requirement,
            file_upload=file,
            document_value=doc_value,
            is_active=True
        )
        return new_doc
    except DocumentRequirement.DoesNotExist:
        return None

def check_kyc_compliance(user_detail):
    """
    Checks if all mandatory documents are uploaded and active.
    Returns (Bool: Compliant, List: Missing Requirements)
    """
    # Get all mandatory reqs for this specific user type, country, office
    mandatory_reqs = DocumentRequirement.objects.filter(
        user_type=user_detail.user_type,
        country=user_detail.country,
        office=user_detail.office,
        is_mandatory=True
    )
    
    # Get all current active docs for the user
    uploaded_req_ids = UserDocument.objects.filter(
        user_detail=user_detail,
        is_active=True
    ).values_list('document_requirement_id', flat=True)
    
    missing = [req for req in mandatory_reqs if req.id not in uploaded_req_ids]
    
    return len(missing) == 0, missing

def update_user_kyc_status(user_detail):
    """
    Automated status updates based on document presence
    """
    compliant, missing = check_kyc_compliance(user_detail)
    
    if not compliant:
        user_detail.status = KYCStatusChoices.KYC_PENDING
    else:
        # If all docs are there, set to pending approval from admin
        if user_detail.status in [KYCStatusChoices.DRAFT, KYCStatusChoices.KYC_PENDING]:
            user_detail.status = KYCStatusChoices.PENDING_APPROVAL
            
    user_detail.save(update_fields=['status'])
    return user_detail.status
