import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kyc_backend.settings')
django.setup()

from kyc_app.models import UserDetail, DocumentRequirement

# Check the latest user
user = UserDetail.objects.last()
if user:
    print(f"User: {user.name}, Type: {user.user_type.name}, Country: {user.country.name}, Office: {user.office.name}")
    reqs = DocumentRequirement.objects.filter(
        user_type=user.user_type,
        country=user.country,
        office=user.office
    )
    print(f"Requirements count: {reqs.count()}")
    for r in reqs:
        print(f"  Req ID: {r.id}, Doc: {r.document_type.name if r.document_type else 'NONE'}")
    
    docs = user.documents.all()
    print(f"Documents count: {docs.count()}")
    for d in docs:
        print(f"  Doc ID: {d.id}, Req: {d.document_requirement_id}, Active: {d.is_active}")
else:
    print("No users found")
