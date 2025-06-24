import { posthog } from './posthog';

// Track page views
export const trackPageView = (page: string) => {
  try {
    posthog.capture('$pageview', { 
      page,
      referrer: document.referrer || null
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

// Track clicks
export const trackClick = (
  element: string, 
  page: string, 
  elementType?: string,
  elementText?: string,
  elementClass?: string,
  elementId?: string
) => {
  try {
    posthog.capture('element_click', { 
      element, 
      page, 
      element_type: elementType,
      element_text: elementText,
      element_class: elementClass,
      element_id: elementId
    });
  } catch (error) {
    console.error('Error tracking click:', error);
  }
};

// Track visit duration
export const trackVisitDuration = (duration: number, page: string, isBounce: boolean = false) => {
  try {
    posthog.capture('visit_duration', { 
      duration, 
      page,
      is_bounce: isBounce
    });
  } catch (error) {
    console.error('Error tracking visit duration:', error);
  }
};

// Initialize analytics
export const initAnalytics = () => {
  // Track initial page view
  trackPageView(window.location.pathname);
  
  // Set up visit duration tracking
  const startTime = Date.now();
  
  // Track duration when user leaves the page
  window.addEventListener('beforeunload', () => {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    trackVisitDuration(duration, window.location.pathname);
  });
  
  // Set up click tracking
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target) return;
    
    // Get element details
    const elementType = target.tagName.toLowerCase();
    const elementText = target.textContent?.trim().substring(0, 100) || '';
    const elementClass = target.className || '';
    const elementId = target.id || '';
    
    // Create a descriptive element name
    let elementName = elementType;
    if (elementId) elementName += `#${elementId}`;
    if (elementClass) elementName += `.${elementClass.split(' ')[0]}`;
    if (elementText) elementName += `:${elementText.substring(0, 20)}`;
    
    trackClick(
      elementName,
      window.location.pathname,
      elementType,
      elementText,
      elementClass,
      elementId
    );
  });
};