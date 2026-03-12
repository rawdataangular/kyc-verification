import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

interface DocType {
    id: string;
    name: string;
    category: string;
    isMandatory: boolean;
    status: 'active' | 'inactive';
}

@Component({
    selector: 'app-settings-doc-types',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="card p-5 border-0 shadow-sm bg-white">
      <div class="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h3 class="fw-bold mb-1">Document Types</h3>
          <p class="text-secondary small fw-medium mb-0">Define the types of documents that can be required.</p>
        </div>
        <button class="btn btn-primary d-flex align-items-center gap-2 fw-bold px-4 py-2 rounded-3 shadow-sm">
          <i-lucide name="plus" style="width: 18px;"></i-lucide>
          <span>Add Type</span>
        </button>
      </div>

      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>Document Name</th>
              <th>Category</th>
              <th>Default Priority</th>
              <th>Status</th>
              <th class="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            @for (docType of docTypes(); track docType.id) {
              <tr>
                <td>{{ docType.name }}</td>
                <td><span class="badge bg-light text-secondary border border-secondary-subtle small fw-bold">{{ docType.category | uppercase }}</span></td>
                <td><span class="fw-bold fs-6 text-dark" [ngClass]="{'text-danger': docType.isMandatory, 'text-primary': !docType.isMandatory}">{{ docType.isMandatory ? 'High' : 'Normal' }}</span></td>
                <td><span class="badge rounded-pill bg-success-subtle text-success fw-bold">{{ docType.status | uppercase }}</span></td>
                <td class="text-end">
                   <button class="btn btn-sm btn-link text-primary fw-bold text-decoration-none">Edit</button>
                   <button class="btn btn-sm btn-link text-danger fw-bold text-decoration-none ms-2">Delete</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class SettingsDocTypesComponent {
    docTypes = signal<DocType[]>([
        { id: 'DT01', name: 'Aadhaar Card', category: 'Personal ID', isMandatory: true, status: 'active' },
        { id: 'DT02', name: 'GST Certificate', category: 'Business ID', isMandatory: true, status: 'active' },
        { id: 'DT03', name: 'Utility Bill', category: 'Proof of Address', isMandatory: false, status: 'active' }
    ]);
}
