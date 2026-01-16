import { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'

const JSONViewer = ({ data, level = 0 }) => {
  const [expanded, setExpanded] = useState({})

  const toggleExpand = (key) => {
    setExpanded(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const renderValue = (value, key, path = '') => {
    const fullPath = path ? `${path}.${key}` : key

    if (value === null) {
      return <span className="json-null">null</span>
    }

    if (typeof value === 'boolean') {
      return <span className="json-boolean">{value.toString()}</span>
    }

    if (typeof value === 'number') {
      return <span className="json-number">{value}</span>
    }

    if (typeof value === 'string') {
      return <span className="json-string">"{value}"</span>
    }

    if (Array.isArray(value)) {
      const isExpanded = expanded[fullPath]
      const previewCount = 3

      return (
        <div className="inline-block">
          <button
            onClick={() => toggleExpand(fullPath)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <span className="ml-1">Array[{value.length}]</span>
          </button>
          
          {isExpanded ? (
            <div className="ml-6 mt-1 border-l-2 border-gray-200 pl-4">
              {value.map((item, idx) => (
                <div key={idx} className="py-1">
                  <span className="json-key">{idx}: </span>
                  {renderValue(item, idx, fullPath)}
                </div>
              ))}
            </div>
          ) : value.length > 0 ? (
            <span className="text-gray-500 ml-2">
              [{value.slice(0, previewCount).map((item, idx) => (
                <span key={idx}>
                  {idx > 0 && ', '}
                  {typeof item === 'object' ? '{...}' : JSON.stringify(item)}
                </span>
              ))}
              {value.length > previewCount && ', ...'}]
            </span>
          ) : (
            <span className="text-gray-500 ml-2">[]</span>
          )}
        </div>
      )
    }

    if (typeof value === 'object') {
      const keys = Object.keys(value)
      const isExpanded = expanded[fullPath]

      return (
        <div className="inline-block">
          <button
            onClick={() => toggleExpand(fullPath)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <span className="ml-1">Object{keys.length > 0 ? ` {${keys.length}}` : ''}</span>
          </button>
          
          {isExpanded ? (
            <div className="ml-6 mt-1 border-l-2 border-gray-200 pl-4">
              {keys.map((k) => (
                <div key={k} className="py-1">
                  <span className="json-key">{k}: </span>
                  {renderValue(value[k], k, fullPath)}
                </div>
              ))}
            </div>
          ) : keys.length > 0 ? (
            <span className="text-gray-500 ml-2">
              {'{'}...{'}'}
            </span>
          ) : (
            <span className="text-gray-500 ml-2">{'{}'}</span>
          )}
        </div>
      )
    }

    return <span>{String(value)}</span>
  }

  return (
    <div className="json-viewer bg-gray-50 rounded-lg p-4 max-h-[600px] overflow-auto">
      <div className="space-y-1">
        {Object.keys(data).map((key) => (
          <div key={key} className="py-1">
            <span className="json-key">{key}: </span>
            {renderValue(data[key], key)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default JSONViewer
