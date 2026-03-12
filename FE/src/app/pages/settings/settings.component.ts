import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, RouterModule, RouterOutlet, LucideAngularModule],
    template: `
    <div class="row g-4 h-100">
      <!-- Secondary Settings Sidebar -->
      <div class="col-lg-3">
        <aside class="sidebar-secondary p-4 bg-white border-0 shadow-sm rounded-4 h-100 sticky-top" style="top: 2rem;">
          <h4 class="fw-bold mb-4 px-2">Settings Hub</h4>
          <nav class="nav flex-column gap-1">
             <a routerLink="general" routerLinkActive="active" class="nav-link-secondary">
               <i-lucide name="settings" class="me-2" style="width: 16px;"></i-lucide>
               General Preferences
             </a>
             <a routerLink="offices" routerLinkActive="active" class="nav-link-secondary">
               <i-lucide name="building-2" class="me-2" style="width: 16px;"></i-lucide>
               Managing Offices
             </a>
             <a routerLink="countries" routerLinkActive="active" class="nav-link-secondary">
               <i-lucide name="globe" class="me-2" style="width: 16px;"></i-lucide>
               Global Regions
             </a>
             <a routerLink="doc-types" routerLinkActive="active" class="nav-link-secondary">
               <i-lucide name="file-text" class="me-2" style="width: 16px;"></i-lucide>
               Document Types
             </a>
             <a routerLink="user-types" routerLinkActive="active" class="nav-link-secondary">
               <i-lucide name="users" class="me-2" style="width: 16px;"></i-lucide>
               User Classifications
             </a>
             <div class="border-top my-3 mx-2 opacity-50"></div>
             <a routerLink="mapping-matrix" routerLinkActive="active" class="nav-link-secondary">
               <i-lucide name="git-pull-request" class="me-2" style="width: 16px;"></i-lucide>
               Mapping Matrix
             </a>
          </nav>
        </aside>
      </div>

      <!-- Settings Content Viewport -->
      <div class="col-lg-9">
         <router-outlet></router-outlet>
      </div>
    </div>

    <!-- Additional styling for secondary sidebar -->
    <style>
      .nav-link-secondary {
        color: #64748b;
        font-weight: 600;
        padding: 0.8rem 1.2rem;
        border-radius: 12px;
        transition: all 0.2s;
        text-decoration: none !important;
        display: flex;
        align-items: center;
        font-size: 0.9rem;
      }
      .nav-link-secondary:hover {
        background-color: #f8fafc;
        color: #2563eb;
      }
      .nav-link-secondary.active {
        background-color: #eff6ff;
        color: #2563eb;
      }
    </style>
  `
})
export class SettingsComponent { }
