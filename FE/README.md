# KYC Verification Portal - Frontend

Modern Angular application for KYC (Know Your Customer) tracking and verification.

## Tech Stack
- **Framework**: Angular 21 (Standalone Components, Signals)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide Icons
- **State Management**: RxJS BehaviorSubjects & Angular Signals
- **Internationalization**: ngx-translate

## Architecture
- **ThemeService**: Handles light/dark mode persistence and class toggling.
- **CustomerService**: Manages user state and provides mock KYC verification logic.
- **Responsive Layout**: Enterprise SaaS aesthetic with a clean sidebar and data-dense tables.

## Components
- **Dashboard**: High-level overview of customers, status badges, and search/filter functionality.
- **KYC Detail**: Shared module for creating new users and verifying existing ones. Includes a document grid with upload simulations and verification loading states.
- **Settings**: System configuration including Master Data management (Ports/Offices/DocTypes) and the Document Mapping Matrix.

## Getting Started
1. Navigate to `/FE` folder.
2. Run `npm install`.
3. Run `npm start` to launch the development server at `http://localhost:4200`.

## Reference
Alinged with Django backend models found in `@BE/kyc_app/models.py`.
