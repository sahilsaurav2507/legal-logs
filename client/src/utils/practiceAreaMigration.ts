/**
 * Practice Area Migration Utilities
 * 
 * Utilities to help migrate existing free-text practice areas to standardized values
 * and provide backward compatibility for the enhanced recommendation system.
 */

import { findBestMatchingPracticeArea, migratePracticeArea, PRACTICE_AREAS } from '@/constants/practiceAreas';
import { userApi } from '@/services/api';

export interface MigrationResult {
  originalValue: string;
  migratedValue: string;
  confidence: 'high' | 'medium' | 'low' | 'none';
  suggestions?: string[];
}

/**
 * Analyze and suggest migration for a practice area value
 */
export const analyzePracticeAreaMigration = (originalValue: string): MigrationResult => {
  if (!originalValue || originalValue.trim().length === 0) {
    return {
      originalValue,
      migratedValue: 'General',
      confidence: 'low',
      suggestions: ['General', 'Student']
    };
  }

  const normalizedOriginal = originalValue.toLowerCase().trim();
  
  // Check if it's already a valid practice area
  const exactMatch = PRACTICE_AREAS.find(area => 
    area.value.toLowerCase() === normalizedOriginal ||
    area.label.toLowerCase() === normalizedOriginal
  );

  if (exactMatch) {
    return {
      originalValue,
      migratedValue: exactMatch.value,
      confidence: 'high'
    };
  }

  // Find best match
  const bestMatch = findBestMatchingPracticeArea(originalValue);
  
  if (bestMatch) {
    // Determine confidence based on similarity
    const keywords = bestMatch.keywords || [];
    const matchingKeywords = keywords.filter(keyword => 
      normalizedOriginal.includes(keyword.toLowerCase()) ||
      keyword.toLowerCase().includes(normalizedOriginal)
    );

    let confidence: 'high' | 'medium' | 'low' = 'low';
    if (matchingKeywords.length >= 2) {
      confidence = 'high';
    } else if (matchingKeywords.length === 1) {
      confidence = 'medium';
    }

    // Generate additional suggestions
    const suggestions = PRACTICE_AREAS
      .filter(area => area.value !== bestMatch.value)
      .filter(area => {
        const areaKeywords = area.keywords || [];
        return areaKeywords.some(keyword => 
          normalizedOriginal.includes(keyword.toLowerCase())
        );
      })
      .slice(0, 3)
      .map(area => area.value);

    return {
      originalValue,
      migratedValue: bestMatch.value,
      confidence,
      suggestions: suggestions.length > 0 ? suggestions : undefined
    };
  }

  return {
    originalValue,
    migratedValue: 'General',
    confidence: 'none',
    suggestions: ['General', 'Student', 'Corporate Law']
  };
};

/**
 * Batch analyze multiple practice area values
 */
export const batchAnalyzePracticeAreas = (values: string[]): MigrationResult[] => {
  return values.map(value => analyzePracticeAreaMigration(value));
};

/**
 * Get migration statistics for a set of practice areas
 */
export const getMigrationStatistics = (results: MigrationResult[]) => {
  const stats = {
    total: results.length,
    highConfidence: 0,
    mediumConfidence: 0,
    lowConfidence: 0,
    noMatch: 0,
    mostCommonMigrations: {} as { [key: string]: number }
  };

  results.forEach(result => {
    switch (result.confidence) {
      case 'high':
        stats.highConfidence++;
        break;
      case 'medium':
        stats.mediumConfidence++;
        break;
      case 'low':
        stats.lowConfidence++;
        break;
      case 'none':
        stats.noMatch++;
        break;
    }

    // Track migration patterns
    const migration = `${result.originalValue} → ${result.migratedValue}`;
    stats.mostCommonMigrations[migration] = (stats.mostCommonMigrations[migration] || 0) + 1;
  });

  return stats;
};

/**
 * Validate that a practice area value is compatible with the new system
 */
export const validatePracticeAreaCompatibility = (value: string): {
  isValid: boolean;
  needsMigration: boolean;
  suggestedValue?: string;
} => {
  if (!value || value.trim().length === 0) {
    return {
      isValid: false,
      needsMigration: true,
      suggestedValue: 'General'
    };
  }

  const isStandardized = PRACTICE_AREAS.some(area => area.value === value);
  
  if (isStandardized) {
    return {
      isValid: true,
      needsMigration: false
    };
  }

  const migration = analyzePracticeAreaMigration(value);
  
  return {
    isValid: false,
    needsMigration: true,
    suggestedValue: migration.migratedValue
  };
};

/**
 * Helper function to update user practice area with migration
 */
export const migrateUserPracticeArea = async (
  userId: number, 
  currentValue: string,
  autoMigrate: boolean = false
): Promise<{
  success: boolean;
  migration?: MigrationResult;
  error?: string;
}> => {
  try {
    const migration = analyzePracticeAreaMigration(currentValue);
    
    // Only auto-migrate if confidence is high or if explicitly requested
    if (autoMigrate || migration.confidence === 'high') {
      await userApi.updateProfile({
        practice_area: migration.migratedValue
      });

      return {
        success: true,
        migration
      };
    }

    return {
      success: false,
      migration,
      error: 'Migration requires manual confirmation due to low confidence'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Generate a user-friendly migration report
 */
export const generateMigrationReport = (result: MigrationResult): string => {
  const { originalValue, migratedValue, confidence, suggestions } = result;
  
  let report = `Original: "${originalValue}" → Suggested: "${migratedValue}"`;
  
  switch (confidence) {
    case 'high':
      report += ' (High confidence match)';
      break;
    case 'medium':
      report += ' (Medium confidence match)';
      break;
    case 'low':
      report += ' (Low confidence match)';
      break;
    case 'none':
      report += ' (No clear match found, using default)';
      break;
  }

  if (suggestions && suggestions.length > 0) {
    report += `\nAlternative suggestions: ${suggestions.join(', ')}`;
  }

  return report;
};

export default {
  analyzePracticeAreaMigration,
  batchAnalyzePracticeAreas,
  getMigrationStatistics,
  validatePracticeAreaCompatibility,
  migrateUserPracticeArea,
  generateMigrationReport
};
