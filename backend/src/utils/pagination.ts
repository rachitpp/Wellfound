import { Request } from 'express';

export interface PaginationOptions {
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

/**
 * Parse pagination parameters from request query
 * @param req Express request
 * @param defaultLimit Default limit if not specified (default: 10)
 * @param maxLimit Maximum allowed limit (default: 100)
 */
export const getPaginationParams = (
  req: Request,
  defaultLimit: number = 10,
  maxLimit: number = 100
): { page: number; limit: number; skip: number } => {
  // Get page and limit from query parameters
  let page = parseInt(req.query.page as string) || 1;
  let limit = parseInt(req.query.limit as string) || defaultLimit;
  
  // Ensure page is at least 1
  page = page < 1 ? 1 : page;
  
  // Ensure limit is within bounds
  limit = limit < 1 ? defaultLimit : limit;
  limit = limit > maxLimit ? maxLimit : limit;
  
  // Calculate skip for MongoDB
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

/**
 * Generate pagination metadata
 * @param totalDocs Total number of documents
 * @param page Current page
 * @param limit Items per page
 */
export const getPaginationMetadata = (
  totalDocs: number,
  page: number,
  limit: number
): PaginationOptions => {
  const totalPages = Math.ceil(totalDocs / limit);
  
  // Calculate if there are next and previous pages
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  
  return {
    page,
    limit,
    totalDocs,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null,
  };
};

/**
 * Convert query parameters to MongoDB filter
 * @param fields Object containing field mappings
 * @param query Query parameters from request
 */
export const createFilter = (
  fields: Record<string, string | { field: string; type?: 'string' | 'number' | 'boolean' | 'date' | 'array' }>,
  query: Record<string, any>
): Record<string, any> => {
  const filter: Record<string, any> = {};
  
  for (const [param, value] of Object.entries(query)) {
    // Skip pagination parameters and empty values
    if (['page', 'limit', 'sort', 'fields'].includes(param) || !value) {
      continue;
    }
    
    const fieldConfig = fields[param];
    if (!fieldConfig) continue;
    
    const fieldName = typeof fieldConfig === 'string' ? fieldConfig : fieldConfig.field;
    const fieldType = typeof fieldConfig === 'object' ? fieldConfig.type || 'string' : 'string';
    
    // Handle different types of filters
    if (param.endsWith('_gt') || param.endsWith('_gte') || param.endsWith('_lt') || param.endsWith('_lte')) {
      const operator = param.endsWith('_gt') 
        ? '$gt' 
        : param.endsWith('_gte')
          ? '$gte'
          : param.endsWith('_lt')
            ? '$lt'
            : '$lte';
      
      const actualParam = param.replace(/_(gt|gte|lt|lte)$/, '');
      const actualField = fields[actualParam];
      if (!actualField) continue;
      
      const actualFieldName = typeof actualField === 'string' ? actualField : actualField.field;
      
      filter[actualFieldName] = filter[actualFieldName] || {};
      
      // Convert value to the right type
      let parsedValue: any = value;
      if (fieldType === 'number') {
        parsedValue = Number(value);
      } else if (fieldType === 'date') {
        parsedValue = new Date(value);
      } else if (fieldType === 'boolean') {
        parsedValue = value === 'true';
      }
      
      filter[actualFieldName][operator] = parsedValue;
    } else if (param.endsWith('_in')) {
      // Handle in operator (comma-separated values)
      const actualParam = param.replace(/_in$/, '');
      const actualField = fields[actualParam];
      if (!actualField) continue;
      
      const actualFieldName = typeof actualField === 'string' ? actualField : actualField.field;
      
      let values = (value as string).split(',');
      
      // Convert values to the right type
      if (fieldType === 'number') {
        values = values.map(v => Number(v)) as unknown as string[];
      } else if (fieldType === 'boolean') {
        values = values.map(v => v === 'true') as unknown as string[];
      } else if (fieldType === 'date') {
        values = values.map(v => new Date(v)) as unknown as string[];
      }
      
      filter[actualFieldName] = { $in: values };
    } else if (fieldType === 'array' && param.endsWith('_all')) {
      // Handle matching all elements in array (e.g., skills_all=javascript,react)
      const actualParam = param.replace(/_all$/, '');
      const actualField = fields[actualParam];
      if (!actualField) continue;
      
      const actualFieldName = typeof actualField === 'string' ? actualField : actualField.field;
      const values = (value as string).split(',').map(v => v.trim());
      
      filter[actualFieldName] = { $all: values };
    } else if (fieldType === 'string' && typeof value === 'string') {
      // Add text search capabilities for string fields
      if (param.endsWith('_like')) {
        const actualParam = param.replace(/_like$/, '');
        const actualField = fields[actualParam];
        if (!actualField) continue;
        
        const actualFieldName = typeof actualField === 'string' ? actualField : actualField.field;
        filter[actualFieldName] = { $regex: value, $options: 'i' };
      } else {
        // Exact match
        filter[fieldName] = value;
      }
    } else {
      // Basic exact matching
      let parsedValue: any = value;
      if (fieldType === 'number') {
        parsedValue = Number(value);
      } else if (fieldType === 'date') {
        parsedValue = new Date(value);
      } else if (fieldType === 'boolean') {
        parsedValue = value === 'true';
      }
      
      filter[fieldName] = parsedValue;
    }
  }
  
  return filter;
};

/**
 * Parse sort parameters from query
 * @param sortQuery Sort query string (e.g., "createdAt:desc,title:asc")
 * @param fields Allowed fields for sorting
 * @param defaultSort Default sort if none provided
 */
export const parseSortParams = (
  sortQuery: string | undefined,
  fields: string[],
  defaultSort: Record<string, 1 | -1> = { createdAt: -1 }
): Record<string, 1 | -1> => {
  if (!sortQuery) return defaultSort;
  
  const sortObj: Record<string, 1 | -1> = {};
  const sortParams = sortQuery.split(',');
  
  for (const param of sortParams) {
    const [field, order] = param.split(':');
    
    // Check if field is allowed for sorting
    if (fields.includes(field)) {
      sortObj[field] = order?.toLowerCase() === 'desc' ? -1 : 1;
    }
  }
  
  return Object.keys(sortObj).length > 0 ? sortObj : defaultSort;
};

/**
 * Prepare pagination response with metadata and results
 * @param results Array of results from database query
 * @param options Pagination options with totalDocs
 */
export const preparePaginationResponse = <T>(
  results: T[],
  options: { page: number; limit: number; totalDocs: number }
): { results: T[]; pagination: PaginationOptions } => {
  const metadata = getPaginationMetadata(options.totalDocs, options.page, options.limit);
  
  return {
    results,
    pagination: metadata
  };
};
