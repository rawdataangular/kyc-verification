import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kyc_backend.settings')
django.setup()

from kyc_app.models import UserDocument

# Set all documents to active
count = UserDocument.objects.all().update(is_active=True)
print(f"Updated {count} documents to active=True")
