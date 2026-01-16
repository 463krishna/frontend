# Comparison Page Documentation

## Overview

The Comparison Page provides a split-screen interface for comparing two documents side by side. Currently implemented with **Page Mode** comparison, with placeholders for Section, Table, and String modes.

## Features

### ✅ Implemented (Page Mode)

#### 1. Split-Screen Layout
- **50/50 Split**: Each document gets half the screen width
- **Color-Coded**: Document 1 (Blue), Document 2 (Green)
- **Responsive**: Stacks vertically on mobile devices

#### 2. Document Selection
- **Dual Dropdowns**: Select two different documents
- **Validation**: Prevents comparing same document
- **Auto-Selection**: Automatically selects first two documents if available

#### 3. Page Comparison
- **Page Number Input**: Specify which page to compare
- **Metadata Display**: Shows page dimensions, word count, character count
- **Content Display**: Full page text in scrollable containers
- **Similarity Metrics**: 
  - Cosine Similarity
  - Jaccard Similarity
  - Levenshtein Similarity
  - Word Count Difference

#### 4. Text Differences
- **Diff Viewer**: Shows detailed text differences
- **Side-by-Side**: Document 1 vs Document 2
- **Position Info**: Where differences occur
- **Operation Type**: Changed, added, deleted segments
- **Limited Display**: First 20 differences with "show more" indicator

### 🔜 Coming Soon

- **Section Mode**: Compare document sections by title/query
- **Table Mode**: Compare tables with cell-level diffs
- **String Mode**: Find and compare specific string occurrences

## UI Components

### Header Section
```
Document Comparison
Compare two documents side by side
```

### Configuration Panel
- Document 1 dropdown
- Document 2 dropdown
- Comparison mode tabs (Page/Section/Table/String)
- Mode-specific inputs (e.g., page number)
- "Compare Documents" button with validation

### Similarity Metrics Card
- Gradient background (blue to purple)
- 4 metric cards in grid layout
- Color-coded by metric type
- Large percentage display

### Split-Screen Comparison
**Left Side (Document 1 - Blue):**
- Header with document name
- Page number badge
- Metadata section
- Content section (scrollable)

**Right Side (Document 2 - Green):**
- Header with document name
- Page number badge
- Metadata section
- Content section (scrollable)

### Text Differences Section
- Collapsible list of differences
- Badge for operation type
- Grid layout showing both versions
- Color-coded backgrounds (red for doc1, green for doc2)

## API Integration

### Endpoint Used
```javascript
POST /api/v1/comparison/page
```

### Request Structure
```json
{
  "file_id_1": "doc1_id",
  "file_id_2": "doc2_id",
  "page_number": 1
}
```

### Response Structure
```json
{
  "file_id_1": "doc1_id",
  "file_id_2": "doc2_id",
  "page_number": 1,
  "comparison_type": "page",
  "page_doc1": {
    "page_number": 1,
    "text": "Page content...",
    "word_count": 150,
    "char_count": 800,
    "dimensions": {
      "width": 612,
      "height": 792
    }
  },
  "page_doc2": {
    "page_number": 1,
    "text": "Page content...",
    "word_count": 145,
    "char_count": 780,
    "dimensions": {
      "width": 612,
      "height": 792
    }
  },
  "similarity_metrics": {
    "cosine_similarity": 0.95,
    "jaccard_similarity": 0.87,
    "levenshtein_similarity": 0.92,
    "word_count_diff": 5
  },
  "text_diffs": [
    {
      "operation": "changed",
      "position": 100,
      "text_doc1": "original text",
      "text_doc2": "modified text"
    }
  ]
}
```

## Color Scheme

### Document 1 (Blue Theme)
- Border: `border-blue-300`
- Header Background: `bg-blue-50`
- Text Color: `text-blue-900`
- Badge: Blue variant

### Document 2 (Green Theme)
- Border: `border-green-300`
- Header Background: `bg-green-50`
- Text Color: `text-green-900`
- Badge: Green variant

### Metrics
- Cosine: Blue (`text-blue-600`)
- Jaccard: Green (`text-green-600`)
- Levenshtein: Purple (`text-purple-600`)
- Word Count: Orange (`text-orange-600`)

### Differences
- Document 1: Red background (`bg-red-50 border-red-200`)
- Document 2: Green background (`bg-green-50 border-green-200`)

## State Management

```javascript
const [documents, setDocuments] = useState([])          // Available documents
const [doc1Id, setDoc1Id] = useState('')               // Selected doc 1
const [doc2Id, setDoc2Id] = useState('')               // Selected doc 2
const [comparisonMode, setComparisonMode] = useState('page')  // Current mode
const [loading, setLoading] = useState(false)          // Loading state
const [comparisonResult, setComparisonResult] = useState(null)  // Results
const [pageNumber, setPageNumber] = useState(1)        // Page mode: page number
```

## User Flow

1. **Load Page**: Fetches available documents
2. **Select Documents**: Choose two different documents from dropdowns
3. **Choose Mode**: Currently only "Page" mode is active
4. **Configure**: Enter page number to compare
5. **Compare**: Click "Compare Documents" button
6. **View Results**:
   - See similarity metrics at top
   - Compare documents side by side
   - Review detailed text differences

## Validation

### Pre-Comparison Checks
- ✅ Both documents selected
- ✅ Documents are different
- ✅ Page number is valid (≥ 1)

### During Comparison
- Loading spinner shown
- Button disabled
- Toast notification for progress

### Post-Comparison
- Success toast with metric summary
- Results rendered in split view
- Console log for debugging

## Responsive Design

### Desktop (lg+)
- Two-column grid layout
- Side-by-side document comparison
- Horizontal metrics grid

### Tablet (md)
- Maintained two-column for documents
- Metrics in 2x2 grid

### Mobile
- Stacked layout (single column)
- Documents shown vertically
- Metrics in single column

## Keyboard & Accessibility

- Tab navigation through form elements
- Disabled state for invalid selections
- Color contrast meets WCAG standards
- Screen reader friendly labels

## Performance Optimizations

- Lazy rendering: Only active tab content shown
- Limited diffs: First 20 shown by default
- Scrollable containers: Prevents page bloat
- Efficient re-renders: Proper state management

## Error Handling

### User Errors
- Same document selected → Toast warning
- No documents selected → Toast warning
- Mode not implemented → Toast info

### API Errors
- Network failure → Toast error with details
- Invalid response → Console error + toast
- Caught in try-catch block

## Future Enhancements

### Section Mode
- Section title input
- Hierarchical section display
- Section-level similarity

### Table Mode
- Table selection dropdown
- Cell-by-cell comparison
- Visual table diff

### String Mode
- Search query input
- Context length slider
- Occurrence highlighting
- Jump to occurrence feature

### General Improvements
- Export comparison results
- Side-by-side diff highlighting
- Synchronized scrolling
- Zoom controls
- Print/PDF export

## Testing Checklist

- [ ] Load page with no documents
- [ ] Load page with 1 document
- [ ] Load page with 2+ documents
- [ ] Select same document for both → Error shown
- [ ] Select different documents → Ready indicator
- [ ] Compare page 1 → Results shown
- [ ] Compare non-existent page → Error handled
- [ ] View all similarity metrics
- [ ] Scroll through long content
- [ ] View text differences
- [ ] Switch between modes
- [ ] Responsive layout on mobile
- [ ] Console logs working

## Code Structure

```
ComparisonPage.jsx
├── State Management
├── useEffect - Fetch Documents
├── fetchDocuments()
├── handleCompare()
│   ├── Validation
│   ├── API Call
│   └── Result Setting
├── getDocumentName()
├── renderPageComparison()
│   ├── Similarity Metrics
│   ├── Split View
│   │   ├── Document 1
│   │   └── Document 2
│   └── Text Diffs
└── Main Render
    ├── Header
    ├── Configuration Panel
    ├── Loading State
    └── Results
```

## Tips for Developers

1. **Debug API Responses**: Check console for `[Comparison] API Response`
2. **Test Edge Cases**: Empty pages, missing metadata, no diffs
3. **Validate Colors**: Ensure blue/green distinction is clear
4. **Check Scrolling**: Long content should scroll within cards
5. **Mobile Testing**: Verify stacked layout works well

## Related Files

- `src/pages/ComparisonPage.jsx` - Main component
- `src/api/comparison.js` - API client functions
- `src/App.jsx` - Route configuration
- `src/components/Layout.jsx` - Navigation menu
