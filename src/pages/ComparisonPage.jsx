import { useState, useEffect } from 'react'
import { GitCompare, FileText, ArrowLeftRight, Loader2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { documentsApi } from '../api/documents'
import { comparisonApi } from '../api/comparison'

const ComparisonPage = () => {
  const [documents, setDocuments] = useState([])
  const [doc1Id, setDoc1Id] = useState('')
  const [doc2Id, setDoc2Id] = useState('')
  const [comparisonMode, setComparisonMode] = useState('page')
  const [loading, setLoading] = useState(false)
  const [comparisonResult, setComparisonResult] = useState(null)
  
  // Page mode specific state
  const [pageNumber, setPageNumber] = useState(1)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const data = await documentsApi.listDocuments()
      setDocuments(data.documents || [])
      if (data.documents && data.documents.length >= 2) {
        setDoc1Id(data.documents[0].file_id)
        setDoc2Id(data.documents[1].file_id)
      }
    } catch (error) {
      toast.error('Failed to fetch documents')
      console.error(error)
    }
  }

  const handleCompare = async () => {
    if (!doc1Id || !doc2Id) {
      toast.error('Please select both documents')
      return
    }

    if (doc1Id === doc2Id) {
      toast.error('Please select different documents')
      return
    }

    setLoading(true)
    const loadingToast = toast.loading('Comparing documents...')

    try {
      let data
      switch (comparisonMode) {
        case 'page':
          data = await comparisonApi.comparePage(doc1Id, doc2Id, pageNumber)
          break
        case 'section':
          // Will implement later
          toast.error('Section comparison not yet implemented')
          setLoading(false)
          return
        case 'table':
          // Will implement later
          toast.error('Table comparison not yet implemented')
          setLoading(false)
          return
        case 'string':
          // Will implement later
          toast.error('String comparison not yet implemented')
          setLoading(false)
          return
        default:
          throw new Error('Unknown comparison mode')
      }

      console.log('[Comparison] API Response:', data)
      setComparisonResult(data)
      toast.success('Comparison complete!', { id: loadingToast })
    } catch (error) {
      console.error('[Comparison] Error:', error)
      toast.error(error.response?.data?.detail || 'Comparison failed', { id: loadingToast })
    } finally {
      setLoading(false)
    }
  }

  const getDocumentName = (fileId) => {
    const doc = documents.find(d => d.file_id === fileId)
    return doc?.filename || fileId
  }

  const renderPageComparison = () => {
    if (!comparisonResult) return null

    const { page_doc1, page_doc2, similarity_metrics, text_diffs } = comparisonResult

    return (
      <div className="space-y-6">
        {/* Similarity Metrics */}
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <GitCompare className="w-5 h-5 mr-2" />
            Similarity Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-xs text-gray-600 mb-1">Cosine Similarity</p>
              <p className="text-2xl font-bold text-blue-600">
                {(similarity_metrics?.cosine_similarity * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-xs text-gray-600 mb-1">Jaccard Similarity</p>
              <p className="text-2xl font-bold text-green-600">
                {(similarity_metrics?.jaccard_similarity * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-xs text-gray-600 mb-1">Levenshtein</p>
              <p className="text-2xl font-bold text-purple-600">
                {(similarity_metrics?.levenshtein_similarity * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-xs text-gray-600 mb-1">Word Count Diff</p>
              <p className="text-2xl font-bold text-orange-600">
                {similarity_metrics?.word_count_diff || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Split View Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Document 1 */}
          <div className="card border-2 border-blue-300">
            <div className="bg-blue-50 -m-6 mb-4 p-4 rounded-t-lg border-b-2 border-blue-200">
              <h3 className="font-semibold text-blue-900 flex items-center justify-between">
                <span className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Document 1
                </span>
                <span className="badge badge-info">Page {page_doc1?.page_number}</span>
              </h3>
              <p className="text-sm text-blue-700 mt-1 truncate">
                {getDocumentName(doc1Id)}
              </p>
            </div>

            {/* Metadata */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Metadata</h4>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                {page_doc1?.page_number && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Page Number:</span>
                    <span className="font-medium">{page_doc1.page_number}</span>
                  </div>
                )}
                {page_doc1?.dimensions && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimensions:</span>
                    <span className="font-medium">
                      {Math.round(page_doc1.dimensions.width)} × {Math.round(page_doc1.dimensions.height)}
                    </span>
                  </div>
                )}
                {page_doc1?.word_count !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Word Count:</span>
                    <span className="font-medium">{page_doc1.word_count}</span>
                  </div>
                )}
                {page_doc1?.char_count !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Characters:</span>
                    <span className="font-medium">{page_doc1.char_count}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Content</h4>
              <div className="bg-gray-50 rounded-lg p-4 max-h-[500px] overflow-auto">
                <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {page_doc1?.text || 'No content available'}
                </div>
              </div>
            </div>
          </div>

          {/* Document 2 */}
          <div className="card border-2 border-green-300">
            <div className="bg-green-50 -m-6 mb-4 p-4 rounded-t-lg border-b-2 border-green-200">
              <h3 className="font-semibold text-green-900 flex items-center justify-between">
                <span className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Document 2
                </span>
                <span className="badge badge-success">Page {page_doc2?.page_number}</span>
              </h3>
              <p className="text-sm text-green-700 mt-1 truncate">
                {getDocumentName(doc2Id)}
              </p>
            </div>

            {/* Metadata */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Metadata</h4>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                {page_doc2?.page_number && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Page Number:</span>
                    <span className="font-medium">{page_doc2.page_number}</span>
                  </div>
                )}
                {page_doc2?.dimensions && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimensions:</span>
                    <span className="font-medium">
                      {Math.round(page_doc2.dimensions.width)} × {Math.round(page_doc2.dimensions.height)}
                    </span>
                  </div>
                )}
                {page_doc2?.word_count !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Word Count:</span>
                    <span className="font-medium">{page_doc2.word_count}</span>
                  </div>
                )}
                {page_doc2?.char_count !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Characters:</span>
                    <span className="font-medium">{page_doc2.char_count}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Content</h4>
              <div className="bg-gray-50 rounded-lg p-4 max-h-[500px] overflow-auto">
                <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {page_doc2?.text || 'No content available'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text Diffs */}
        {text_diffs && text_diffs.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Text Differences ({text_diffs.length})
            </h3>
            <div className="space-y-3 max-h-[400px] overflow-auto">
              {text_diffs.slice(0, 20).map((diff, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <span className="badge badge-warning">
                      {diff.operation || 'changed'}
                    </span>
                    {diff.position && (
                      <span className="text-xs text-gray-600">
                        Position: {diff.position}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Document 1:</p>
                      <p className="bg-red-50 border border-red-200 rounded px-2 py-1">
                        {diff.text_doc1 || '(empty)'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Document 2:</p>
                      <p className="bg-green-50 border border-green-200 rounded px-2 py-1">
                        {diff.text_doc2 || '(empty)'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {text_diffs.length > 20 && (
                <p className="text-center text-sm text-gray-600">
                  ... and {text_diffs.length - 20} more differences
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Document Comparison</h1>
        <p className="mt-2 text-gray-600">Compare two documents side by side</p>
      </div>

      {/* Configuration Panel */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <GitCompare className="w-5 h-5 mr-2" />
          Comparison Settings
        </h2>

        <div className="space-y-4">
          {/* Document Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document 1
              </label>
              <select
                value={doc1Id}
                onChange={(e) => setDoc1Id(e.target.value)}
                className="input"
                disabled={loading}
              >
                <option value="">Select first document...</option>
                {documents.map((doc) => (
                  <option key={doc.file_id} value={doc.file_id}>
                    {doc.filename}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document 2
              </label>
              <select
                value={doc2Id}
                onChange={(e) => setDoc2Id(e.target.value)}
                className="input"
                disabled={loading}
              >
                <option value="">Select second document...</option>
                {documents.map((doc) => (
                  <option key={doc.file_id} value={doc.file_id}>
                    {doc.filename}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comparison Mode
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => setComparisonMode('page')}
                className={`btn ${comparisonMode === 'page' ? 'btn-primary' : 'btn-secondary'}`}
                disabled={loading}
              >
                <FileText className="w-4 h-4" />
                Page
              </button>
              <button
                onClick={() => setComparisonMode('section')}
                className={`btn ${comparisonMode === 'section' ? 'btn-primary' : 'btn-secondary'}`}
                disabled={loading}
              >
                Section
              </button>
              <button
                onClick={() => setComparisonMode('table')}
                className={`btn ${comparisonMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
                disabled={loading}
              >
                Table
              </button>
              <button
                onClick={() => setComparisonMode('string')}
                className={`btn ${comparisonMode === 'string' ? 'btn-primary' : 'btn-secondary'}`}
                disabled={loading}
              >
                String
              </button>
            </div>
          </div>

          {/* Mode-specific Options */}
          {comparisonMode === 'page' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Number
              </label>
              <input
                type="number"
                min="1"
                value={pageNumber}
                onChange={(e) => setPageNumber(parseInt(e.target.value) || 1)}
                className="input w-32"
                disabled={loading}
              />
            </div>
          )}

          {/* Compare Button */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-600">
              {doc1Id && doc2Id && doc1Id !== doc2Id ? (
                <span className="text-green-600 flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  Ready to compare
                </span>
              ) : (
                <span className="text-gray-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Select two different documents
                </span>
              )}
            </div>
            <button
              onClick={handleCompare}
              disabled={loading || !doc1Id || !doc2Id || doc1Id === doc2Id}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Comparing...
                </>
              ) : (
                <>
                  <ArrowLeftRight className="w-4 h-4" />
                  Compare Documents
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4" />
            <p className="text-gray-600">Analyzing documents...</p>
          </div>
        </div>
      )}

      {!loading && comparisonResult && comparisonMode === 'page' && renderPageComparison()}
    </div>
  )
}

export default ComparisonPage
