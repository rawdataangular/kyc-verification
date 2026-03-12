import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private darkMode = signal<boolean>(this.getInitialTheme());

    constructor() {
        this.applyTheme();
    }

    toggleTheme() {
        this.darkMode.update(v => !v);
        this.updateStorage();
        this.applyTheme();
    }

    isDark() {
        return this.darkMode();
    }

    private getInitialTheme(): boolean {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    private updateStorage() {
        localStorage.setItem('theme', this.darkMode() ? 'dark' : 'light');
    }

    private applyTheme() {
        if (this.darkMode()) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
}
