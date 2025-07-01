/**
 * Practice Areas Constants and Utilities
 * 
 * This file defines the standardized practice area categories used throughout
 * the application for consistent user registration and content categorization.
 */

export interface PracticeArea {
  value: string;
  label: string;
  description?: string;
  keywords?: string[];
}

/**
 * Standardized practice area categories
 * These should match the blog post categories for optimal recommendations
 */
export const PRACTICE_AREAS: PracticeArea[] = [
  {
    value: 'Constitutional Law',
    label: 'Constitutional Law',
    description: 'Constitutional interpretation, civil rights, and fundamental legal principles',
    keywords: ['constitution', 'civil rights', 'fundamental rights', 'constitutional interpretation', 'supreme court']
  },
  {
    value: 'Corporate Law',
    label: 'Corporate Law',
    description: 'Business formation, mergers, acquisitions, and corporate governance',
    keywords: ['business', 'corporate', 'mergers', 'acquisitions', 'company law', 'securities', 'governance']
  },
  {
    value: 'Employment Law',
    label: 'Employment Law',
    description: 'Workplace rights, labor relations, and employment disputes',
    keywords: ['employment', 'labor', 'workplace', 'discrimination', 'wages', 'workers rights']
  },
  {
    value: 'Intellectual Property',
    label: 'Intellectual Property',
    description: 'Patents, trademarks, copyrights, and trade secrets',
    keywords: ['patent', 'trademark', 'copyright', 'intellectual property', 'IP', 'trade secrets']
  },
  {
    value: 'Criminal Law',
    label: 'Criminal Law',
    description: 'Criminal defense, prosecution, and criminal justice system',
    keywords: ['criminal', 'defense', 'prosecution', 'crime', 'justice', 'court', 'trial']
  },
  {
    value: 'Family Law',
    label: 'Family Law',
    description: 'Divorce, custody, adoption, and family-related legal matters',
    keywords: ['family', 'divorce', 'custody', 'adoption', 'marriage', 'domestic']
  },
  {
    value: 'Civil Litigation',
    label: 'Civil Litigation',
    description: 'Civil disputes, commercial litigation, and dispute resolution',
    keywords: ['litigation', 'civil', 'dispute', 'lawsuit', 'court', 'settlement']
  },
  {
    value: 'Real Estate Law',
    label: 'Real Estate Law',
    description: 'Property transactions, real estate disputes, and property law',
    keywords: ['real estate', 'property', 'land', 'housing', 'transactions', 'zoning']
  },
  {
    value: 'Regulatory Compliance',
    label: 'Regulatory Compliance',
    description: 'Regulatory advisory, compliance programs, and government relations',
    keywords: ['regulatory', 'compliance', 'government', 'regulations', 'policy']
  },
  {
    value: 'General',
    label: 'General Practice',
    description: 'General legal practice covering multiple areas of law',
    keywords: ['general', 'practice', 'legal', 'law', 'attorney', 'lawyer']
  },
  {
    value: 'Student',
    label: 'Law Student',
    description: 'Currently studying law or preparing for legal career',
    keywords: ['student', 'law school', 'legal education', 'studying', 'academic']
  }
];

/**
 * Get practice area by value
 */
export const getPracticeAreaByValue = (value: string): PracticeArea | undefined => {
  return PRACTICE_AREAS.find(area => area.value === value);
};

/**
 * Get practice area keywords for similarity matching
 */
export const getPracticeAreaKeywords = (value: string): string[] => {
  const area = getPracticeAreaByValue(value);
  return area?.keywords || [];
};

/**
 * Get all practice area values
 */
export const getPracticeAreaValues = (): string[] => {
  return PRACTICE_AREAS.map(area => area.value);
};

/**
 * Get all practice area labels
 */
export const getPracticeAreaLabels = (): string[] => {
  return PRACTICE_AREAS.map(area => area.label);
};

/**
 * Check if a practice area value is valid
 */
export const isValidPracticeArea = (value: string): boolean => {
  return PRACTICE_AREAS.some(area => area.value === value);
};

/**
 * Find the best matching practice area for a given text
 * This is useful for migrating existing free-text practice areas
 */
export const findBestMatchingPracticeArea = (text: string): PracticeArea | null => {
  if (!text || text.trim().length === 0) {
    return null;
  }

  const normalizedText = text.toLowerCase().trim();
  
  // First, try exact match
  const exactMatch = PRACTICE_AREAS.find(area => 
    area.value.toLowerCase() === normalizedText ||
    area.label.toLowerCase() === normalizedText
  );
  
  if (exactMatch) {
    return exactMatch;
  }

  // Then try keyword matching
  let bestMatch: PracticeArea | null = null;
  let maxMatches = 0;

  for (const area of PRACTICE_AREAS) {
    const keywords = area.keywords || [];
    const matches = keywords.filter(keyword => 
      normalizedText.includes(keyword.toLowerCase()) ||
      keyword.toLowerCase().includes(normalizedText)
    ).length;

    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = area;
    }
  }

  // If no keyword matches, try partial string matching
  if (!bestMatch) {
    bestMatch = PRACTICE_AREAS.find(area => 
      area.value.toLowerCase().includes(normalizedText) ||
      normalizedText.includes(area.value.toLowerCase())
    ) || null;
  }

  return bestMatch;
};

/**
 * Migrate existing practice area text to standardized value
 */
export const migratePracticeArea = (existingValue: string): string => {
  const match = findBestMatchingPracticeArea(existingValue);
  return match ? match.value : 'General';
};

export default PRACTICE_AREAS;
