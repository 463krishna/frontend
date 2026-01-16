/**
 * ComparisonResultItem.jsx
 * Displays individual comparison result with similarity breakdown and diff viewer
 * 
 * Props:
 * - result: ComparisonResult object from API
 * - index: Index in results list
 * - isExpanded: Boolean to control expand/collapse
 * - onToggleExpanded: Callback function for toggle
 */

import React from 'react';
import DiffViewer from './DiffViewer';

const ComparisonResultItem = ({ 
  result, 
  index, 
  isExpanded = true, 
  onToggleExpanded 
}) => {
  const getSimilarityColor = (similarity) => {
    if (similarity >= 0.9) return '#10b981'; // green
    if (similarity >= 0.75) return '#f59e0b'; // orange
    if (similarity >= 0.6) return '#f87171'; // light red
    return '#dc2626'; // red
  };

  const getSimilarityLabel = (similarity) => {
    if (similarity >= 0.9) return 'Excellent';
    if (similarity >= 0.75) return 'Good';
    if (similarity >= 0.6) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="result-item">
      {/* Header with toggle */}
      <div 
        className={`result-header ${isExpanded ? 'expanded' : 'collapsed'}`}
        onClick={onToggleExpanded}
      >
        <div className="header-left">
          <span className="toggle-icon">
            {isExpanded ? '▼' : '▶'}
          </span>
          <div className="item-info">
            <span className="item-type-badge" data-type={result.item_type}>
              {result.item_type.toUpperCase()}
            </span>
            <span className="item-id">{result.item_id}</span>
          </div>
        </div>

        <div className="header-right">
          <div 
            className="similarity-badge"
            style={{ 
              backgroundColor: getSimilarityColor(result.similarity.overall) 
            }}
            title={getSimilarityLabel(result.similarity.overall)}
          >
            <span className="similarity-value">
              {(result.similarity.overall * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="result-content">
          {/* Similarity Scores Grid */}
          <div className="similarity-section">
            <h4>Similarity Breakdown</h4>
            <div className="similarity-scores">
              <ScoreBar 
                label="Structural" 
                value={result.similarity.structural}
              />
              <ScoreBar 
                label="Content" 
                value={result.similarity.content}
              />
              <ScoreBar 
                label="Lexical" 
                value={result.similarity.lexical}
              />
              <ScoreBar 
                label="Semantic" 
                value={result.similarity.semantic}
              />
              {result.similarity.embedding !== null && (
                <ScoreBar 
                  label="Embedding" 
                  value={result.similarity.embedding}
                />
              )}
            </div>
          </div>

          {/* Diff Viewer */}
          {result.segments && result.segments.length > 0 && (
            <div className="diff-section">
              <h4>Content Differences</h4>
              <DiffViewer segments={result.segments} />
            </div>
          )}

          {/* Metadata */}
          {result.metadata && Object.keys(result.metadata).length > 0 && (
            <div className="metadata-section">
              <h4>Additional Information</h4>
              <div className="metadata-content">
                {Object.entries(result.metadata).map(([key, value]) => (
                  <div key={key} className="metadata-item">
                    <span className="metadata-key">{key}:</span>
                    <span className="metadata-value">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Score Bar Component
const ScoreBar = ({ label, value }) => {
  const percentage = (value * 100).toFixed(1);
  const color = value >= 0.75 ? '#10b981' : value >= 0.5 ? '#f59e0b' : '#ef4444';

  return (
    <div className="score-item">
      <div className="score-header">
        <span className="score-label">{label}</span>
        <span className="score-percentage">{percentage}%</span>
      </div>
      <div className="score-bar-container">
        <div 
          className="score-bar-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        ></div>
      </div>
    </div>
  );
};

export default ComparisonResultItem;
