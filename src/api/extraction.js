import apiClient from './client';

export const extractionApi = {
  // Extract full JSON (be careful - large response)
  extractFullJSON: async (fileId, forceReextract = false) => {
    const response = await apiClient.post('/api/v1/extraction/json', {
      file_id: fileId,
      force_reextract: forceReextract,
    });
    return response.data;
  },

  // Get extraction summary (recommended)
  getExtractionSummary: async (fileId) => {
    const response = await apiClient.post('/api/v1/extraction/summary', {
      file_id: fileId,
    });
    return response.data;
  },

  // Extract pages
  extractPages: async (fileId, startPage, endPage = null) => {
    const response = await apiClient.post('/api/v1/extraction/pages', {
      file_id: fileId,
      start_page: startPage,
      end_page: endPage,
    });
    return response.data;
  },

  // Extract sections
  extractSections: async (fileId, maxDepth = null) => {
    const response = await apiClient.post('/api/v1/extraction/sections', {
      file_id: fileId,
      max_depth: maxDepth,
    });
    return response.data;
  },

  // Extract tables
  extractTables: async (fileId) => {
    const response = await apiClient.post('/api/v1/extraction/tables', {
      file_id: fileId,
    });
    return response.data;
  },

  // Search text
  searchText: async (fileId, query, contextChars = 100, maxResults = 100) => {
    const response = await apiClient.post('/api/v1/extraction/search', {
      file_id: fileId,
      query: query,
      context_chars: contextChars,
      max_results: maxResults,
    });
    return response.data;
  },
};
