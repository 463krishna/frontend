import { useState } from 'react'
import { Layers, Calculator } from 'lucide-react'
import toast from 'react-hot-toast'
import { embeddingApi } from '../api/embedding'

const EmbeddingPage = () => {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [similarity, setSimilarity] = useState(null)
  const [loading, setLoading] = useState(false)
  const [metric, setMetric] = useState('cosine')

  const handleComputeSimilarity = async () => {
    if (!text1.trim() || !text2.trim()) {
      toast.error('Please enter both texts')
      return
    }

    setLoading(true)
    const loadingToast = toast.loading('Computing similarity...')

    try {
      const data = await embeddingApi.computeSimilarity(text1, text2, metric)
      setSimilarity(data)
      toast.success('Similarity computed!', { id: loadingToast })
    } catch (error) {
      toast.error('Failed to compute similarity', { id: loadingToast })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getSimilarityColor = (score) => {
    if (score >= 0.8) return 'text-green-600 bg-green-50 border-green-200'
    if (score >= 0.5) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Semantic Embedding</h1>
        <p className="mt-2 text-gray-600">Compute semantic similarity using BAAI/bge-m3 embeddings</p>
      </div>

      {/* Similarity Calculator */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calculator className="w-5 h-5 mr-2" />
          Text Similarity Calculator
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Text
            </label>
            <textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Enter first text..."
              rows={4}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Second Text
            </label>
            <textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Enter second text..."
              rows={4}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Similarity Metric
            </label>
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              className="input"
            >
              <option value="cosine">Cosine Similarity</option>
              <option value="euclidean">Euclidean Distance</option>
              <option value="dot">Dot Product</option>
            </select>
          </div>

          <button
            onClick={handleComputeSimilarity}
            disabled={loading || !text1.trim() || !text2.trim()}
            className="btn btn-primary"
          >
            <Layers className="w-4 h-4" />
            {loading ? 'Computing...' : 'Compute Similarity'}
          </button>
        </div>

        {similarity && (
          <div className="mt-6">
            <div className={`border rounded-lg p-6 ${getSimilarityColor(similarity.similarity)}`}>
              <div className="text-center">
                <p className="text-sm font-medium mb-2">Similarity Score</p>
                <p className="text-5xl font-bold">
                  {(similarity.similarity * 100).toFixed(2)}%
                </p>
                <p className="text-sm mt-2">
                  Metric: {similarity.metric}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600 mb-2">Embedding Dimension</p>
                <p className="text-2xl font-bold text-gray-900">1024</p>
                <p className="text-xs text-gray-600 mt-1">BAAI/bge-m3</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600 mb-2">Processing Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {similarity.processing_time_ms ? `${similarity.processing_time_ms}ms` : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">About Semantic Embeddings</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>
            This system uses the <strong>BAAI/bge-m3</strong> model to generate 1024-dimensional embeddings
            for semantic text analysis.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Cosine Similarity: Measures angle between vectors (0-1, higher is more similar)</li>
            <li>Euclidean Distance: Measures straight-line distance (lower is more similar)</li>
            <li>Dot Product: Measures vector alignment (higher is more similar)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default EmbeddingPage
