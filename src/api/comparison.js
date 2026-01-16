import apiClient from './client';

export const comparisonApi = {
  // Compare pages
  comparePage: async (fileId1, fileId2, pageNumber) => {
    const response = await apiClient.post('/api/v1/comparison/page', {
      file_id_1: fileId1,
      file_id_2: fileId2,
      page_number: pageNumber,
    });
    return response.data;
  },

  // Compare sections
  compareSection: async (fileId1, fileId2, sectionQuery) => {
    const response = await apiClient.post('/api/v1/comparison/section', {
      file_id_1: fileId1,
      file_id_2: fileId2,
      section_query: sectionQuery,
    });
    return response.data;
  },

  // Compare tables
  compareTable: async (fileId1, fileId2, tableQuery = null) => {
    const response = await apiClient.post('/api/v1/comparison/table', {
      file_id_1: fileId1,
      file_id_2: fileId2,
      table_query: tableQuery,
    });
    return response.data;
  },

  // Compare string occurrences
  compareString: async (fileId1, fileId2, query, contextChars = 50) => {
    const response = await apiClient.post('/api/v1/comparison/string', {
      file_id_1: fileId1,
      file_id_2: fileId2,
      query: query,
      context_chars: contextChars,
    });
    return response.data;
  },

  // Structural comparison (all modes)
  compareStructure: async (fileId1, fileId2) => {
    const response = await apiClient.post('/api/v1/comparison/structure', {
      file_id_1: fileId1,
      file_id_2: fileId2,
    });
    return response.data;
  },
};
