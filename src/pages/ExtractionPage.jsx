import { useState, useEffect } from 'react'
import { Database, FileText, Search, Table, FileJson, BarChart3, ChevronDown, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { documentsApi } from '../api/documents'
import { extractionApi } from '../api/extraction'
import JSONViewer from '../components/JSONViewer'

const ExtractionPage = () => {
  const [documents, setDocuments] = useState([])
  const [selectedDocId, setSelectedDocId] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('summary')
  const [extractionData, setExtractionData] = useState(null)
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  
  // Pages state
  const [startPage, setStartPage] = useState(1)
  const [endPage, setEndPage] = useState(1)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const data = await documentsApi.listDocuments()
      setDocuments(data.documents || [])
      if (data.documents && data.documents.length > 0) {
        setSelectedDocId(data.documents[0].file_id)
      }
    } catch (error) {
      toast.error('Failed to fetch documents')
      console.error(error)
    }
  }

  const handleExtract = async (type) => {
    if (!selectedDocId) {
      toast.error('Please select a document')
      return
    }

    setLoading(true)
    const loadingToast = toast.loading(`Extracting ${type}...`)

    try {
      let data
      switch (type) {
        case 'summary':
          data = await extractionApi.getExtractionSummary(selectedDocId)
          break
        case 'pages':
          data = await extractionApi.extractPages(selectedDocId, startPage, endPage || null)
          break
        case 'sections':
          data = await extractionApi.extractSections(selectedDocId)
          break
        case 'tables':
          data = await extractionApi.extractTables(selectedDocId)
          break
        case 'json':
          data = await extractionApi.extractFullJSON(selectedDocId)
          break
        default:
          throw new Error('Unknown extraction type')
      }
      
      // Debug log to help troubleshoot
      console.log(`[${type}] API Response:`, data)
      
      setExtractionData(data)
      setActiveTab(type)
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} extracted successfully!`, { id: loadingToast })
    } catch (error) {
      console.error(`[${type}] Error:`, error)
      toast.error(error.response?.data?.detail || `Failed to extract ${type}`, { id: loadingToast })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!selectedDocId) {
      toast.error('Please select a document')
      return
    }
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query')
      return
    }

    setLoading(true)
    const loadingToast = toast.loading('Searching...')

    try {
      const data = await extractionApi.searchText(selectedDocId, searchQuery)
      setSearchResults(data)
      setActiveTab('search')
      toast.success(`Found ${data.results?.length || 0} results`, { id: loadingToast })
    } catch (error) {
      toast.error('Search failed', { id: loadingToast })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const renderSummary = () => {
    if (!extractionData) return null
    
    // Extract stats from the API response structure
    const totalPages = extractionData.metadata?.total_pages || 0
    const totalSections = extractionData.content_summary?.total_sections || 0
    const totalTables = extractionData.content_summary?.total_tables || 0
    const totalImages = extractionData.content_summary?.total_images || 0
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Pages</p>
                <p className="text-3xl font-bold text-blue-900 mt-1">
                  {totalPages}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-600 opacity-50" />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Sections</p>
                <p className="text-3xl font-bold text-green-900 mt-1">
                  {totalSections}
                </p>
              </div>
              <Database className="w-8 h-8 text-green-600 opacity-50" />
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Tables</p>
                <p className="text-3xl font-bold text-purple-900 mt-1">
                  {totalTables}
                </p>
              </div>
              <Table className="w-8 h-8 text-purple-600 opacity-50" />
            </div>
          </div>
        </div>

        {/* Additional stats if available */}
        {totalImages > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Images</p>
                <p className="text-3xl font-bold text-orange-900 mt-1">
                  {totalImages}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-3">Document Metadata</h3>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="font-medium text-gray-600">File ID:</dt>
              <dd className="mt-1">
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {extractionData.file_id}
                </code>
              </dd>
            </div>
            {extractionData.extraction_timestamp && (
              <div>
                <dt className="font-medium text-gray-600">Extracted:</dt>
                <dd className="mt-1 text-gray-900">
                  {new Date(extractionData.extraction_timestamp).toLocaleString()}
                </dd>
              </div>
            )}
            {extractionData.cached !== undefined && (
              <div>
                <dt className="font-medium text-gray-600">Cached:</dt>
                <dd className="mt-1">
                  <span className={`badge ${extractionData.cached ? 'badge-success' : 'badge-info'}`}>
                    {extractionData.cached ? 'Yes (from cache)' : 'No (fresh extraction)'}
                  </span>
                </dd>
              </div>
            )}
            {extractionData.metadata?.pdf_version && (
              <div>
                <dt className="font-medium text-gray-600">PDF Version:</dt>
                <dd className="mt-1 text-gray-900">{extractionData.metadata.pdf_version}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Show full content_summary if available */}
        {extractionData.content_summary && Object.keys(extractionData.content_summary).length > 0 && (
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">Content Summary</h3>
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-auto">
              <pre className="text-sm text-gray-800">
                {JSON.stringify(extractionData.content_summary, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderPages = () => {
    if (!extractionData?.extracted_pages) return null

    return (
      <div className="space-y-4">
        {extractionData.extracted_pages.map((page, idx) => (
          <div key={idx} className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">
                Page {page.page_number}
              </h3>
              <div className="flex items-center space-x-2">
                {page.page_width && page.page_height && (
                  <span className="text-xs text-gray-600">
                    {Math.round(page.page_width)} × {Math.round(page.page_height)}
                  </span>
                )}
                <span className="badge badge-info">
                  {page.content?.length || 0} chars
                </span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-auto">
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {page.content || 'No content available'}
              </div>
            </div>
          </div>
        ))}
        
        {extractionData.total_pages && (
          <div className="text-center text-sm text-gray-600">
            Showing {extractionData.extracted_pages.length} of {extractionData.total_pages} pages
          </div>
        )}
      </div>
    )
  }

  const renderSections = () => {
    if (!extractionData?.sections) return null

    return (
      <div className="space-y-3">
        {extractionData.sections.map((section, idx) => (
          <div key={idx} className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900" style={{ marginLeft: `${section.level * 1}rem` }}>
                {section.title || 'Untitled Section'}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="badge badge-info">Level {section.level}</span>
                {section.page_numbers && (
                  <span className="text-sm text-gray-600">
                    Pages: {section.page_numbers.join(', ')}
                  </span>
                )}
              </div>
            </div>
            {section.content && (
              <div className="mt-2 text-sm text-gray-700 line-clamp-3">
                {section.content.substring(0, 200)}...
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  const renderTables = () => {
    if (!extractionData?.tables) return null

    return (
      <div className="space-y-4">
        {extractionData.tables.map((table, idx) => (
          <div key={idx} className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">
                {table.title || `Table ${idx + 1}`}
              </h3>
              <div className="flex items-center space-x-2">
                {table.page_number && (
                  <span className="badge badge-info">Page {table.page_number}</span>
                )}
                <span className="text-sm text-gray-600">
                  {table.rows?.length || 0} rows × {table.headers?.length || 0} cols
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                {table.headers && table.headers.length > 0 && (
                  <thead>
                    <tr>
                      {table.headers.map((header, headerIdx) => (
                        <th key={headerIdx} className="text-sm font-semibold">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {table.rows?.slice(0, 10).map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="text-sm">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {table.rows && table.rows.length > 10 && (
                <p className="text-sm text-gray-600 text-center mt-2">
                  ... and {table.rows.length - 10} more rows
                </p>
              )}
            </div>
          </div>
        ))}
        
        {extractionData.total_tables !== undefined && (
          <div className="text-center text-sm text-gray-600">
            Showing {extractionData.tables.length} of {extractionData.total_tables} tables
          </div>
        )}
      </div>
    )
  }

  const renderSearchResults = () => {
    if (!searchResults) return null

    return (
      <div className="space-y-4">
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-900">
                Found {searchResults.results?.length || 0} occurrences
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Query: "{searchResults.query}"
              </p>
            </div>
            <Search className="w-8 h-8 text-blue-600 opacity-50" />
          </div>
        </div>

        {searchResults.results?.map((result, idx) => (
          <div key={idx} className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="badge badge-info">Page {result.page_number}</span>
              <span className="text-sm text-gray-600">Position: {result.position}</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm">
                <span className="text-gray-600">{result.context_before}</span>
                <span className="bg-yellow-200 font-semibold px-1">{result.matched_text}</span>
                <span className="text-gray-600">{result.context_after}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderJSON = () => {
    if (!extractionData) return null

    return (
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Full JSON Extraction</h3>
          <button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(extractionData, null, 2))
              toast.success('JSON copied to clipboard!')
            }}
            className="btn btn-secondary btn-sm"
          >
            Copy JSON
          </button>
        </div>
        <JSONViewer data={extractionData} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Extraction</h1>
        <p className="mt-2 text-gray-600">Extract and analyze document content</p>
      </div>

      {/* Document Selection & Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Document</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="input"
            >
              <option value="">Select a document...</option>
              {documents.map((doc) => (
                <option key={doc.file_id} value={doc.file_id}>
                  {doc.filename}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleExtract('summary')}
              disabled={loading || !selectedDocId}
              className="btn btn-primary"
            >
              <BarChart3 className="w-4 h-4" />
              Get Summary
            </button>
            
            <button
              onClick={() => handleExtract('sections')}
              disabled={loading || !selectedDocId}
              className="btn btn-secondary"
            >
              <Database className="w-4 h-4" />
              Extract Sections
            </button>
            
            <button
              onClick={() => handleExtract('tables')}
              disabled={loading || !selectedDocId}
              className="btn btn-secondary"
            >
              <Table className="w-4 h-4" />
              Extract Tables
            </button>
            
            <button
              onClick={() => handleExtract('json')}
              disabled={loading || !selectedDocId}
              className="btn btn-secondary"
            >
              <FileJson className="w-4 h-4" />
              Full JSON
            </button>
          </div>

          {/* Pages Range */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Extract Specific Pages
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                value={startPage}
                onChange={(e) => setStartPage(parseInt(e.target.value) || 1)}
                placeholder="Start Page"
                className="input w-32"
              />
              <span className="text-gray-600">to</span>
              <input
                type="number"
                min={startPage}
                value={endPage}
                onChange={(e) => setEndPage(parseInt(e.target.value) || startPage)}
                placeholder="End Page"
                className="input w-32"
              />
              <button
                onClick={() => handleExtract('pages')}
                disabled={loading || !selectedDocId}
                className="btn btn-secondary"
              >
                <FileText className="w-4 h-4" />
                Extract Pages
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Text
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter search query..."
                className="input flex-1"
              />
              <button
                onClick={handleSearch}
                disabled={loading || !selectedDocId}
                className="btn btn-primary"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="loading-spinner" />
        </div>
      )}

      {!loading && extractionData && activeTab === 'summary' && renderSummary()}
      {!loading && extractionData && activeTab === 'pages' && renderPages()}
      {!loading && extractionData && activeTab === 'sections' && renderSections()}
      {!loading && extractionData && activeTab === 'tables' && renderTables()}
      {!loading && extractionData && activeTab === 'json' && renderJSON()}
      {!loading && searchResults && activeTab === 'search' && renderSearchResults()}
    </div>
  )
}

export default ExtractionPage
