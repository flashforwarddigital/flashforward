// View types
export type ViewType = 'landing' | '1996' | '2025' | 'admin';

// Component Props
export interface LandingPageProps {
  onYearSelect: (year: ViewType) => void;
}

export interface Windows95DesktopProps {
  onBack: () => void;
}

export interface ModernSiteProps {
  onBack: () => void;
  setCurrentView: (view: ViewType) => void;
}

// You can add more shared types and interfaces here as needed 