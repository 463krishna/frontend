/**
 * DiffViewer.jsx
 * Core component for visualizing text differences with color-coded highlighting
 * 
 * Color scheme:
 * - Green/White: Content present in both documents
 * - Red: Content only in Document 1 (deleted/removed)
 * - Yellow: Content only in Document 2 (added/new)
 * - Orange: Modified/changed content
 */

import React from 'react';

const DiffViewer = ({ segments }) => {
  const getSegmentClassName = (operation) => {
    const baseClass = 'diff-segment';
    switch (operation) {
      case 'equal':
        return `${baseClass} equal`;
      case 'delete':
        return `${baseClass} delete`;
      case 'insert':
        return `${baseClass} insert`;
      case 'replace':
        return `${baseClass} replace`;
      default:
        return baseClass;
    }
  };

  const getSegmentLabel = (operation) => {
    const labels = {
      equal: 'Common',
      delete: 'Removed',
      insert: 'Added',
      replace: 'Changed',
    };
    return labels[operation] || operation;
  };

  if (!segments || segments.length === 0) {
    return <div className="empty-diff">No differences found</div>;
  }

  // Group consecutive segments of same type for better visualization
  const groupedSegments = groupSegments(segments);

  return (
    <div className="diff-viewer">
      <div className="diff-content">
        {groupedSegments.map((segment, idx) => (
          <div 
            key={idx}
            className={getSegmentClassName(segment.operation)}
            title={`${getSegmentLabel(segment.operation)} - ${segment.text.length} chars`}
          >
            <span className="operation-label">
              {getSegmentLabel(segment.operation)}
            </span>
            <span className="segment-text">
              {truncateText(segment.text, 500)}
            </span>
            {segment.text.length > 500 && (
              <span className="truncation-notice">
                ... ({segment.text.length} chars total)
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to group consecutive segments
function groupSegments(segments) {
  if (!segments || segments.length === 0) return [];
  
  const grouped = [];
  let currentGroup = { ...segments[0], text: segments[0].text };

  for (let i = 1; i < segments.length; i++) {
    if (segments[i].operation === currentGroup.operation) {
      // Same operation, combine text
      currentGroup.text += segments[i].text;
    } else {
      // Different operation, start new group
      grouped.push(currentGroup);
      currentGroup = { ...segments[i], text: segments[i].text };
    }
  }
  grouped.push(currentGroup);

  return grouped;
}

// Helper function to truncate long text
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export default DiffViewer;
