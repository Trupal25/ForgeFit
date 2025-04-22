/**
 * Utility functions for handling database data
 */

/**
 * Converts comma-separated string to array
 * @param str Comma-separated string
 * @returns String array
 */
export const stringToArray = (str: string | null | undefined): string[] => {
  if (!str) return [];
  return str.split(',').map(item => item.trim());
};

/**
 * Converts array to comma-separated string
 * @param arr Array of strings
 * @returns Comma-separated string
 */
export const arrayToString = (arr: string[] | null | undefined): string => {
  if (!arr || !Array.isArray(arr)) return '';
  return arr.join(',');
};

/**
 * Converts JSON string to object
 * @param jsonStr JSON string
 * @returns Parsed object or null
 */
export const jsonStringToObject = <T>(jsonStr: string | null | undefined): T | null => {
  if (!jsonStr) return null;
  try {
    return JSON.parse(jsonStr) as T;
  } catch (error) {
    console.error('Error parsing JSON string:', error);
    return null;
  }
};

/**
 * Converts object to JSON string
 * @param obj Object to convert
 * @returns JSON string
 */
export const objectToJsonString = (obj: any): string => {
  if (!obj) return '';
  try {
    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error converting object to JSON string:', error);
    return '';
  }
};

/**
 * Transforms database entity to frontend format
 * @param entity Database entity
 * @param arrayFields Fields that should be converted from string to array
 * @param jsonFields Fields that should be converted from string to object
 * @returns Transformed entity
 */
export function transformEntity<T extends Record<string, any>>(
  entity: T,
  arrayFields: string[] = [],
  jsonFields: string[] = []
): T {
  if (!entity) return entity;

  const result = { ...entity } as Record<string, any>;

  // Convert string fields to arrays
  for (const field of arrayFields) {
    if (field in result && typeof result[field] === 'string') {
      result[field] = stringToArray(result[field] as string);
    }
  }

  // Convert string fields to objects
  for (const field of jsonFields) {
    if (field in result && typeof result[field] === 'string') {
      result[field] = jsonStringToObject(result[field] as string);
    }
  }

  return result as T;
}

/**
 * Transforms entity for database storage
 * @param entity Frontend entity
 * @param arrayFields Fields that should be converted from array to string
 * @param jsonFields Fields that should be converted from object to string
 * @returns Transformed entity ready for database
 */
export function prepareEntityForDb<T extends Record<string, any>>(
  entity: T,
  arrayFields: string[] = [],
  jsonFields: string[] = []
): Record<string, any> {
  if (!entity) return entity;

  const result = { ...entity } as Record<string, any>;

  // Convert arrays to string fields
  for (const field of arrayFields) {
    if (field in result && Array.isArray(result[field])) {
      result[field] = arrayToString(result[field] as string[]);
    }
  }

  // Convert objects to string fields
  for (const field of jsonFields) {
    if (field in result && typeof result[field] === 'object' && result[field] !== null) {
      result[field] = objectToJsonString(result[field]);
    }
  }

  return result;
} 