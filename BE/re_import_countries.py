import os
import django
import openpyxl

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kyc_backend.settings')
django.setup()

from kyc_app.models import CountryMaster

def import_countries():
    file_path = "county list.xlsx"
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return

    wb = openpyxl.load_workbook(file_path, data_only=True)
    sheet = wb.active
    
    count = 0
    # Start from row 2 to skip headers
    # Headers are: ['COUNTRY', 'COUNTRY CODE', 'CODES 3Letter', 'ISO CODES 2L']
    for row in sheet.iter_rows(min_row=2, values_only=True):
        name = str(row[0]).strip() if row[0] else None
        dial_code = str(row[1]).strip() if row[1] else None
        code_3 = str(row[2]).strip() if row[2] else None
        code_2 = str(row[3]).strip() if row[3] else None
        
        if name:
            country, created = CountryMaster.objects.update_or_create(
                name=name,
                defaults={
                    'dial_code': dial_code,
                    'code_3': code_3,
                    'code_2': code_2
                }
            )
            if created:
                count += 1
                
    print(f"Successfully imported {count} new countries.")

if __name__ == "__main__":
    import_countries()
