import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { LucideAngularModule, Search, LayoutDashboard, UserPlus, Settings, Moon, Sun, ArrowLeft, User, FileText, File, Upload, Check, MoreVertical } from 'lucide-angular';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, LucideAngularModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  themeService = inject(ThemeService);
  readonly icons = {
    Search, LayoutDashboard, UserPlus, Settings, Moon, Sun, ArrowLeft, User, FileText, File, Upload, Check, MoreVertical
  };
}
