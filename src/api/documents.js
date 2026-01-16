import apiClient from './client';

export const documentsApi = {
  // Upload document
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/api/v1/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // List documents
  listDocuments: async (skip = 0, limit = 100) => {
    const response = await apiClient.get('/api/v1/documents', {
      params: { skip, limit },
    });
    return response.data;
  },

  // Get document info
  getDocumentInfo: async (fileId) => {
    const response = await apiClient.get(`/api/v1/documents/${fileId}`);
    return response.data;
  },

  // Delete document
  deleteDocument: async (fileId) => {
    await apiClient.delete(`/api/v1/documents/${fileId}`);
  },
};
