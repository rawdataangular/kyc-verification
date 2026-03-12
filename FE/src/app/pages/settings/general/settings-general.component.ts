import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
    selector: 'app-settings-general',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="card p-5 border-0 shadow-sm bg-white">
      <h3 class="fw-bold mb-4">General Preferences</h3>
      <div class="row g-4">
        <div class="col-md-6">
          <div class="p-4 rounded-4 bg-light border d-flex justify-content-between align-items-center">
            <div>
              <div class="fw-bold fs-5">Interface Theme</div>
              <div class="text-secondary small">Switch between light and dark visual modes.</div>
            </div>
            <div class="form-check form-switch p-0 m-0">
               <input class="form-check-input ms-0" type="checkbox" role="switch" [checked]="themeService.isDark()" (change)="themeService.toggleTheme()" style="width: 2.8rem; height: 1.4rem;">
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="p-4 rounded-4 bg-light border">
            <div class="fw-bold mb-1">Language Support</div>
            <div class="text-secondary small mb-3">Choose the primary language for the portal.</div>
            <select class="form-select border-0 shadow-sm rounded-3">
              <option selected>English (Global)</option>
              <option disabled>Hindi (Coming Soon)</option>
              <option disabled>Arabic (Coming Soon)</option>
            </select>
          </div>
        </div>
        <div class="col-12 mt-4">
          <div class="p-4 rounded-4 bg-light border">
            <div class="fw-bold mb-1">Notification Settings</div>
            <div class="text-secondary small mb-3">Email triggers for KYC actions.</div>
            <div class="form-check mb-2">
              <input class="form-check-input" type="checkbox" id="emailNotif" checked>
              <label class="form-check-label ms-2 fw-medium" for="emailNotif">Every time a document is verified</label>
            </div>
            <div class="form-check mb-2">
              <input class="form-check-input" type="checkbox" id="expiryNotif" checked>
              <label class="form-check-label ms-2 fw-medium" for="expiryNotif">Alert me 30 days before document expiry</label>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-end mt-5 gap-3">
        <button class="btn btn-primary px-5 py-2 fw-bold rounded-3">Save Preferences</button>
      </div>
    </div>
  `
})
export class SettingsGeneralComponent {
    themeService = inject(ThemeService);
}
