/**
 * ComparisonViewer.jsx
 * Main container component for document comparison
 * 
 * Features:
 * - Fetches comparison from API
 * - Displays comparison results with color-coded highlighting
 * - Shows similarity statistics
 * - Expandable/collapsible result items
 * 
 * Props:
 * - doc1Id: ID of first document
 * - doc2Id: ID of second document
 * - mode: Comparison mode (page, section, table, string, all)
 * - apiBaseUrl: Base URL for API (default: http://localhost:8000)
 * - onComparisonComplete: Callback when comparison finishes
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ComparisonResultItem from './ComparisonResultItem';
import './ComparisonViewer.css';

const ComparisonViewer = ({ 
  doc1Id, 
  doc2Id, 
  mode = 'section',
  apiBaseUrl = 'http://localhost:8000',
  onComparisonComplete = null 
}) => {
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set());

  useEffect(() => {
    if (doc1Id && doc2Id) {
      fetchComparison();
    }
  }, [doc1Id, doc2Id, mode]);

  const fetchComparison = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${apiBaseUrl}/api/v1/comparison/documents`,
        {
          file_id_1: doc1Id,
          file_id_2: doc2Id,
          mode: mode,
          query: null, // Set this if you need query-based comparison
        },
        {
          timeout: 30000, // 30 second timeout
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setComparisonData(response.data);
      
      // Initialize all items as expanded
      const allItems = new Set();
      if (response.data.results) {
        response.data.results.forEach((_, idx) => allItems.add(idx));
      }
      setExpandedItems(allItems);

      // Call callback if provided
      if (onComparisonComplete) {
        onComparisonComplete(response.data);
      }
    } catch (err) {
      console.error('Comparison failed:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleItemExpanded = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const getStatisticsFromResults = () => {
    if (!comparisonData?.results) return null;

    const stats = {
      equal: 0,
      delete: 0,
      insert: 0,
      replace: 0,
      avgSimilarity: 0,
    };

    comparisonData.results.forEach((result) => {
      if (result.segments) {
        result.segments.forEach((seg) => {
          stats[seg.operation] = (stats[seg.operation] || 0) + 1;
        });
      }
    });

    const avgSimilarity = comparisonData.results.reduce(
      (sum, r) => sum + r.similarity.overall,
      0
    ) / (comparisonData.results.length || 1);

    stats.avgSimilarity = avgSimilarity;

    return stats;
  };

  if (loading) {
    return (
      <div className="comparison-container">
        <div className="loader">
          <div className="spinner"></div>
          <p>Analyzing documents... This may take a moment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="comparison-container">
        <div className="error-box">
          <h3>Comparison Failed</h3>
          <p>{error}</p>
          <button onClick={fetchComparison} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!comparisonData) {
    return (
      <div className="comparison-container">
        <div className="empty-state">
          <p>Select two documents to compare</p>
        </div>
      </div>
    );
  }

  const stats = getStatisticsFromResults();

  return (
    <div className="comparison-container">
      {/* Header */}
      <div className="comparison-header">
        <div className="header-content">
          <h2>Document Comparison Results</h2>
          <div className="header-info">
            <div className="info-item">
              <span className="label">Document 1:</span>
              <span className="value">{comparisonData.file_id_1}</span>
            </div>
            <div className="info-item">
              <span className="label">Document 2:</span>
              <span className="value">{comparisonData.file_id_2}</span>
            </div>
            <div className="info-item">
              <span className="label">Mode:</span>
              <span className="value">{comparisonData.mode}</span>
            </div>
            <div className="info-item">
              <span className="label">Time:</span>
              <span className="value">{comparisonData.comparison_time_seconds.toFixed(2)}s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="legend">
        <div className="legend-item equal">
          <span className="dot"></span>
          <span>Normal (Both Documents)</span>
        </div>
        <div className="legend-item delete">
          <span className="dot"></span>
          <span>Removed from Document 1</span>
        </div>
        <div className="legend-item insert">
          <span className="dot"></span>
          <span>Added in Document 2</span>
        </div>
        <div className="legend-item replace">
          <span className="dot"></span>
          <span>Modified Content</span>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="statistics">
          <h3>Comparison Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Overall Similarity</span>
              <span className="stat-value">
                {(stats.avgSimilarity * 100).toFixed(1)}%
              </span>
            </div>
            <div className="stat-card equal">
              <span className="stat-label">Common Content</span>
              <span className="stat-value">{stats.equal}</span>
            </div>
            <div className="stat-card delete">
              <span className="stat-label">Removed</span>
              <span className="stat-value">{stats.delete}</span>
            </div>
            <div className="stat-card insert">
              <span className="stat-label">Added</span>
              <span className="stat-value">{stats.insert}</span>
            </div>
            <div className="stat-card replace">
              <span className="stat-label">Modified</span>
              <span className="stat-value">{stats.replace}</span>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="results-container">
        <div className="results-header">
          <h3>Detailed Comparison ({comparisonData.total_comparisons} items)</h3>
          <div className="results-controls">
            <button 
              className="control-button"
              onClick={() => setExpandedItems(
                new Set(comparisonData.results.map((_, i) => i))
              )}
            >
              Expand All
            </button>
            <button 
              className="control-button"
              onClick={() => setExpandedItems(new Set())}
            >
              Collapse All
            </button>
          </div>
        </div>

        <div className="results-list">
          {comparisonData.results.map((result, idx) => (
            <ComparisonResultItem
              key={idx}
              result={result}
              index={idx}
              isExpanded={expandedItems.has(idx)}
              onToggleExpanded={() => toggleItemExpanded(idx)}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="comparison-footer">
        <p className="footer-info">
          Comparison completed in {comparisonData.comparison_time_seconds.toFixed(3)} seconds
        </p>
      </div>
    </div>
  );
};

export default ComparisonViewer;
