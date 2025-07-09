import { PortfolioSubcategory } from '../services/portfolioService';

/**
 * Safely extracts project count from a subcategory
 * Handles number, object, and array formats
 */
export const getProjectCount = (subcategory: PortfolioSubcategory): number => {
  if (typeof subcategory.project_count === 'number') {
    return subcategory.project_count;
  }
  
  if (Array.isArray(subcategory.project_count) && subcategory.project_count.length > 0) {
    const firstItem = subcategory.project_count[0];
    if (typeof firstItem === 'object' && firstItem && 'count' in firstItem) {
      return (firstItem as { count: number }).count;
    }
  }
  
  if (typeof subcategory.project_count === 'object' && subcategory.project_count && 'count' in subcategory.project_count) {
    return (subcategory.project_count as { count: number }).count;
  }
  
  return 0;
};

/**
 * Formats project count for display
 */
export const formatProjectCount = (subcategory: PortfolioSubcategory): string => {
  const count = getProjectCount(subcategory);
  return `${count} photo${count !== 1 ? 's' : ''}`;
}; 