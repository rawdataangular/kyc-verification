import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

interface MappingItem {
    id: string;
    userType: string;
    country: string;
    office: string;
    requiredDocs: string[];
    optionalDocs: string[];
}

@Component({
    selector: 'app-settings-mapping-matrix',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="card p-5 border-0 shadow-sm bg-white">
      <div class="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h3 class="fw-bold mb-1">Mapping Matrix</h3>
          <p class="text-secondary small fw-medium mb-0">Map UserType + Country + Office to specific Document Requirements.</p>
        </div>
        <button class="btn btn-primary d-flex align-items-center gap-2 fw-bold px-4 py-2 rounded-3 shadow-sm">
          <i-lucide name="plus" style="width: 18px;"></i-lucide>
          <span>Create Mapping</span>
        </button>
      </div>

      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>Profile Context</th>
              <th>Requirement Profile</th>
              <th class="text-end">Operations</th>
            </tr>
          </thead>
          <tbody>
            @for (mapping of mappingMatrix(); track mapping.id) {
              <tr class="mb-3">
                <td>
                   <div class="d-flex align-items-center mb-1">
                      <span class="badge bg-primary-subtle text-primary border border-primary-subtle fw-bold me-2">{{ mapping.userType }}</span>
                      <span class="text-dark fw-bold">{{ mapping.country }}</span>
                   </div>
                   <div class="small text-secondary fw-medium"><i-lucide name="map-pin" style="width: 12px; margin-right: 4px;"></i-lucide> {{ mapping.office }} Branch</div>
                </td>
                <td style="max-width: 450px;">
                    <div class="d-flex flex-wrap gap-1 mb-2">
                        @for (doc of mapping.requiredDocs; track doc) {
                           <span class="badge-pill bg-danger-subtle text-danger border border-danger-subtle small fw-bold">REQUIRED: {{ doc }}</span>
                        }
                    </div>
                    <div class="d-flex flex-wrap gap-1">
                        @for (doc of mapping.optionalDocs; track doc) {
                           <span class="badge-pill bg-light text-secondary border border-secondary-subtle small fw-bold">OPTIONAL: {{ doc }}</span>
                        }
                    </div>
                </td>
                <td class="text-end">
                  <button class="btn btn-sm btn-outline-primary fw-bold text-decoration-none px-3">Adjust Matrix</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class SettingsMappingMatrixComponent {
    mappingMatrix = signal<MappingItem[]>([
        {
            id: 'M01',
            userType: 'Individual',
            country: 'India',
            office: 'Mumbai Regional',
            requiredDocs: ['Aadhaar Card', 'PAN Card'],
            optionalDocs: ['Utility Bill', 'Residence Permit']
        },
        {
            id: 'M02',
            userType: 'Company (Local)',
            country: 'United States',
            office: 'New York HQ',
            requiredDocs: ['Certificate of Incorporations', 'Tax ID (EIN)'],
            optionalDocs: ['DUNS Number']
        }
    ]);
}
