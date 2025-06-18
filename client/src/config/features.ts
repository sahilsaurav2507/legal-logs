// Feature flags configuration
// Set to false to hide features, true to show them
export const FEATURE_FLAGS = {
  // Content features
  RESEARCH_PAPERS: false,
  COURSES: false,
  
  // Career features
  JOBS: false,
  INTERNSHIPS: false,
  APPLICATIONS: false,
  MANAGE_APPLICATIONS: false,
  
  // Other features (keep these enabled)
  BLOG_POSTS: true,
  NOTES: true,
  PERSONAL_LIBRARY: true,
  DASHBOARD: true,
  PROFILE: true,
  SETTINGS: true,
  NOTIFICATIONS: true,
  GLOBAL_SEARCH: true,
} as const;

// Helper function to check if a feature is enabled
export const isFeatureEnabled = (feature: keyof typeof FEATURE_FLAGS): boolean => {
  return FEATURE_FLAGS[feature];
};

// Helper function to get enabled navigation items
export const getEnabledNavigationItems = () => {
  return {
    researchPapers: isFeatureEnabled('RESEARCH_PAPERS'),
    courses: isFeatureEnabled('COURSES'),
    jobs: isFeatureEnabled('JOBS'),
    internships: isFeatureEnabled('INTERNSHIPS'),
    applications: isFeatureEnabled('APPLICATIONS'),
    manageApplications: isFeatureEnabled('MANAGE_APPLICATIONS'),
    blogPosts: isFeatureEnabled('BLOG_POSTS'),
    notes: isFeatureEnabled('NOTES'),
    personalLibrary: isFeatureEnabled('PERSONAL_LIBRARY'),
    dashboard: isFeatureEnabled('DASHBOARD'),
    profile: isFeatureEnabled('PROFILE'),
    settings: isFeatureEnabled('SETTINGS'),
    notifications: isFeatureEnabled('NOTIFICATIONS'),
    globalSearch: isFeatureEnabled('GLOBAL_SEARCH'),
  };
}; 