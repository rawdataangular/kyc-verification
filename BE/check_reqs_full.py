import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kyc_backend.settings')
django.setup()

from kyc_app.models import DocumentRequirement

reqs = DocumentRequirement.objects.all()
print(f"Total Requirements: {reqs.count()}")
for r in reqs:
    print(f"ID: {r.id}, Type: {r.user_type.name if r.user_type else 'N/A'}, Country: {r.country.name if r.country else 'N/A'}, Office: {r.office.name if r.office else 'N/A'}, Doc: {r.document_type.name if r.document_type else 'NONE'}")
