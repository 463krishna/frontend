import apiClient from './client';

export const embeddingApi = {
  // Generate embeddings
  generateEmbeddings: async (texts, normalize = true) => {
    const response = await apiClient.post('/api/v1/embedding/embed', {
      texts: texts,
      normalize: normalize,
    });
    return response.data;
  },

  // Compute similarity
  computeSimilarity: async (text1, text2, metric = 'cosine') => {
    const response = await apiClient.post('/api/v1/embedding/similarity', {
      text_1: text1,
      text_2: text2,
      metric: metric,
    });
    return response.data;
  },

  // Bulk similarity
  computeBulkSimilarity: async (pairs, metric = 'cosine') => {
    const response = await apiClient.post('/api/v1/embedding/bulk-similarity', {
      pairs: pairs,
      metric: metric,
    });
    return response.data;
  },
};
