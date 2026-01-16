import { useState, useEffect } from 'react'
import { Upload, FileText, Trash2, RefreshCw, Info, Calendar, HardDrive } from 'lucide-react'
import toast from 'react-hot-toast'
import { documentsApi } from '../api/documents'

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedDocument, setSelectedDocument] = useState(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const data = await documentsApi.listDocuments()
      setDocuments(data.documents || [])
    } catch (error) {
      toast.error('Failed to fetch documents')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Check if it's a PDF
      if (file.type !== 'application/pdf') {
        toast.error('Please select a PDF file')
        return
      }
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file')
      return
    }

    setUploading(true)
    const uploadToast = toast.loading('Uploading document...')

    try {
      const result = await documentsApi.uploadDocument(selectedFile)
      toast.success('Document uploaded successfully!', { id: uploadToast })
      setSelectedFile(null)
      // Reset file input
      document.getElementById('file-input').value = ''
      fetchDocuments()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to upload document', { id: uploadToast })
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (fileId, filename) => {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) {
      return
    }

    const deleteToast = toast.loading('Deleting document...')
    try {
      await documentsApi.deleteDocument(fileId)
      toast.success('Document deleted successfully!', { id: deleteToast })
      fetchDocuments()
    } catch (error) {
      toast.error('Failed to delete document', { id: deleteToast })
      console.error(error)
    }
  }

  const handleViewInfo = async (fileId) => {
    try {
      const info = await documentsApi.getDocumentInfo(fileId)
      setSelectedDocument(info)
    } catch (error) {
      toast.error('Failed to fetch document info')
      console.error(error)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="mt-2 text-gray-600">Upload and manage your PDF documents</p>
        </div>
        <button
          onClick={fetchDocuments}
          disabled={loading}
          className="btn btn-secondary"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Upload Section */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Upload className="w-5 h-5 mr-2" />
          Upload Document
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select PDF File
            </label>
            <input
              id="file-input"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
              disabled={uploading}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary-50 file:text-primary-700
                hover:file:bg-primary-100
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {selectedFile && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-600">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="btn btn-primary"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Documents List */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
          <span className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Your Documents
          </span>
          <span className="badge badge-info">
            {documents.length} document{documents.length !== 1 ? 's' : ''}
          </span>
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner" />
          </div>
        ) : documents.length === 0 ? (
          <div className="empty-state">
            <FileText className="empty-state-icon mx-auto" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No documents yet</h3>
            <p className="text-gray-600">Upload your first PDF document to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Filename</th>
                  <th>File ID</th>
                  <th>Size</th>
                  <th>Upload Date</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.file_id}>
                    <td>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{doc.filename}</span>
                      </div>
                    </td>
                    <td>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {doc.file_id}
                      </code>
                    </td>
                    <td className="text-gray-600">{formatFileSize(doc.file_size_bytes)}</td>
                    <td className="text-gray-600 text-sm">{formatDate(doc.upload_timestamp)}</td>
                    <td>
                      <span className="badge badge-success">Active</span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewInfo(doc.file_id)}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
                          title="View Info"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.file_id, doc.filename)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Document Info Modal */}
      {selectedDocument && (
        <div className="modal-overlay" onClick={() => setSelectedDocument(null)}>
          <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Document Information</h3>
              <button
                onClick={() => setSelectedDocument(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Filename</label>
                  <p className="mt-1 text-gray-900 font-medium">{selectedDocument.filename}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">File ID</label>
                  <p className="mt-1">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {selectedDocument.file_id}
                    </code>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">File Size</label>
                  <p className="mt-1 text-gray-900">{formatFileSize(selectedDocument.file_size_bytes)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Upload Date</label>
                  <p className="mt-1 text-gray-900">{formatDate(selectedDocument.upload_timestamp)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">File Path</label>
                  <p className="mt-1 text-gray-900 text-sm break-all">{selectedDocument.file_path}</p>
                </div>
              </div>

              {selectedDocument.extraction_status && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Extraction Status</h4>
                  <p className="text-sm text-green-700">
                    This document has been processed and extracted
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentsPage
