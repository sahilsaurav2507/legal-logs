# Feature Flags Configuration

This document explains how to enable or disable different features in the LawFort application using the feature flags system.

## Overview

The feature flags system allows you to easily hide or show different sections of the application without deleting any code. This is useful for:
- Temporarily hiding features that are not ready for production
- A/B testing different feature sets
- Gradual feature rollouts
- Maintenance mode for specific features

## Configuration File

The feature flags are configured in `src/config/features.ts`. You can modify the `FEATURE_FLAGS` object to enable or disable features.

## Available Features

### Content Features
- `RESEARCH_PAPERS`: Research paper functionality (browse, create, edit, submit)
- `COURSES`: Course management functionality (browse, create, edit)

### Career Features
- `JOBS`: Job posting and application functionality
- `INTERNSHIPS`: Internship posting and application functionality
- `APPLICATIONS`: User application tracking functionality
- `MANAGE_APPLICATIONS`: Admin/editor application management functionality

### Other Features (Keep Enabled)
- `BLOG_POSTS`: Blog post functionality
- `NOTES`: Note creation and management
- `PERSONAL_LIBRARY`: Personal library functionality
- `DASHBOARD`: User and editor dashboards
- `PROFILE`: User profile management
- `SETTINGS`: Application settings
- `NOTIFICATIONS`: Notification system
- `GLOBAL_SEARCH`: Global search functionality

## How to Use

### Enable a Feature
```typescript
export const FEATURE_FLAGS = {
  RESEARCH_PAPERS: true,  // Enable research papers
  COURSES: true,         // Enable courses
  // ... other features
};
```

### Disable a Feature
```typescript
export const FEATURE_FLAGS = {
  RESEARCH_PAPERS: false,  // Hide research papers
  COURSES: false,         // Hide courses
  // ... other features
};
```

## What Gets Hidden When a Feature is Disabled

When you disable a feature, the following elements are hidden:

1. **Navigation Links**: Sidebar, header, and footer navigation links
2. **Routes**: All related routes become inaccessible
3. **Create Buttons**: "Create" dropdown menu items
4. **Dashboard Sections**: Related dashboard widgets and sections
5. **Search Tabs**: Global search tabs for that content type
6. **Library Tabs**: Personal library tabs for that content type

## Example: Hiding Research Papers

To hide research papers functionality:

```typescript
export const FEATURE_FLAGS = {
  RESEARCH_PAPERS: false,  // This will hide:
  // - Research Papers navigation link
  // - /research routes
  // - Create Research Paper button
  // - Research Papers search tab
  // - Research Papers library tab
  // - Research Papers dashboard sections
};
```

## Current Configuration

As of now, the following features are **disabled**:
- Research Papers
- Courses  
- Jobs
- Internships
- Applications
- Manage Applications

The following features are **enabled**:
- Blog Posts
- Notes
- Personal Library
- Dashboard
- Profile
- Settings
- Notifications
- Global Search

## Re-enabling Features

To re-enable any disabled feature, simply change its value from `false` to `true` in the `FEATURE_FLAGS` object. The feature will immediately become available without requiring any code changes.

## Best Practices

1. **Test Thoroughly**: Always test the application after changing feature flags
2. **Document Changes**: Update this file when adding new features
3. **Gradual Rollout**: Consider enabling features gradually for better user experience
4. **Backup Configuration**: Keep a backup of your feature flag configuration

## Adding New Features

To add a new feature to the feature flags system:

1. Add the feature flag to the `FEATURE_FLAGS` object
2. Update the `getEnabledNavigationItems()` function
3. Use the feature flag in relevant components
4. Update this documentation

Example:
```typescript
// In features.ts
export const FEATURE_FLAGS = {
  NEW_FEATURE: false,  // Add new feature flag
  // ... existing flags
};

export const getEnabledNavigationItems = () => {
  return {
    newFeature: isFeatureEnabled('NEW_FEATURE'),  // Add to helper function
    // ... existing items
  };
};
``` 