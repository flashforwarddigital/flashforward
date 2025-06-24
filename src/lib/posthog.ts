import posthog from 'posthog-js';

// Initialize PostHog with environment variables
const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;

// Only initialize if we have the required config
if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: posthogHost || 'https://us.i.posthog.com',
    capture_pageview: true, // Automatically capture pageviews
    capture_pageleave: true, // Capture when users leave the page
    autocapture: true, // Automatically capture clicks, form submissions etc.
    persistence: 'localStorage',
    session_recording: {
      enabled: true,
    },
    loaded: (posthog) => {
      // Add any additional configuration after PostHog is loaded
      if (import.meta.env.DEV) {
        // Enable debug mode in development
        posthog.debug();
      }
    },
  });
} else {
  // Create a mock implementation for when PostHog is not available
  const mockPosthog = {
    capture: (eventName: string, properties?: Record<string, any>) => {
      console.log(`[PostHog Mock] Event: ${eventName}`, properties);
    },
    identify: (id: string, properties?: Record<string, any>) => {
      console.log(`[PostHog Mock] Identify: ${id}`, properties);
    },
    reset: () => {
      console.log(`[PostHog Mock] Reset user`);
    },
    opt_in_capturing: () => {
      console.log(`[PostHog Mock] Opt in capturing`);
    },
    opt_out_capturing: () => {
      console.log(`[PostHog Mock] Opt out capturing`);
    },
    debug: () => {
      console.log(`[PostHog Mock] Debug mode enabled`);
    },
  };

  // @ts-ignore - Replace posthog with mock implementation
  Object.keys(mockPosthog).forEach(key => {
    posthog[key] = mockPosthog[key];
  });
  
  console.warn('PostHog not initialized: Missing configuration');
}

// Utility functions for manual tracking
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  posthog.capture(eventName, properties);
};

export const identifyUser = (id: string, properties?: Record<string, any>) => {
  posthog.identify(id, properties);
};

export const resetUser = () => {
  posthog.reset();
};

// Export the posthog instance for direct use
export { posthog };