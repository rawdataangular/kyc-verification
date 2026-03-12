import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

interface UserType {
    id: string;
    name: string;
    description: string;
}

@Component({
    selector: 'app-settings-user-types',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="card p-5 border-0 shadow-sm bg-white">
      <div class="d-flex justify-content-between align-items-center mb-5">
        <div>
           <h3 class="fw-bold mb-1">User Classifications</h3>
           <p class="text-secondary small fw-medium mb-0">Define the system-wide categories for users and entities.</p>
        </div>
        <button class="btn btn-primary d-flex align-items-center gap-2 fw-bold px-4 py-2 rounded-3 shadow-sm">
          <i-lucide name="plus" style="width: 18px;"></i-lucide>
          <span>Add Category</span>
        </button>
      </div>

      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>System Mapping Description</th>
              <th class="text-end pe-4">Operations</th>
            </tr>
          </thead>
          <tbody>
            @for (type of userTypes(); track type.id) {
              <tr>
                <td><div class="fw-bold">{{ type.name }}</div></td>
                <td style="max-width: 400px;"><span class="text-secondary small fw-medium">{{ type.description }}</span></td>
                <td class="text-end pe-4">
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
export class SettingsUserTypesComponent {
    userTypes = signal<UserType[]>([
        { id: '1', name: 'Individual', description: 'Single entity, personal identification required.' },
        { id: '2', name: 'Proprietorship', description: 'Business owned by a single individual with legal entity identity.' },
        { id: '3', name: 'LLC / Private Limited', description: 'Incorporated company, mandatory business registration documents.' }
    ]);
}
