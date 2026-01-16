# Frontend Bug Fixes - Extraction Page

## Issues Fixed

### 1. Summary Not Displaying (Main Issue)
**Problem:** When selecting a document and clicking "Get Summary", the API was working but frontend showed 0s everywhere.

**Root Cause:** API response structure mismatch
- **API Returns:**
  ```json
  {
    "metadata": { "total_pages": 45 },
    "content_summary": { "total_sections": 12, "total_tables": 8 }
  }
  ```
- **Frontend Was Looking For:**
  ```javascript
  extractionData.summary?.total_pages  // ❌ Wrong
  ```

**Fix Applied:**
```javascript
// ✅ Correct way to access data
const totalPages = extractionData.metadata?.total_pages || 0
const totalSections = extractionData.content_summary?.total_sections || 0
const totalTables = extractionData.content_summary?.total_tables || 0
```

### 2. Pages Extraction Display
**Problem:** Wrong field names for extracted pages.

**Root Cause:** API returns `extracted_pages` array with `content` field, not `pages` with `segments`.

**Fix Applied:**
- Changed `extractionData?.pages` → `extractionData?.extracted_pages`
- Changed `page.segments` → `page.content`
- Added page dimensions display
- Added character count badge

### 3. Tables Extraction Display
**Problem:** Tables were using wrong field name `data` instead of `rows` and `headers`.

**Root Cause:** API Table model structure:
```json
{
  "table_id": "...",
  "title": "...",
  "headers": ["Col1", "Col2"],
  "rows": [["val1", "val2"], ...],
  "page_number": 1
}
```

**Fix Applied:**
- Changed `table.data` → `table.rows` and `table.headers`
- Added proper table header rendering
- Added table title display
- Added row × column count display

### 4. Enhanced Metadata Display
**Improvements:**
- Show extraction timestamp correctly (`extraction_timestamp` not `extraction_date`)
- Display cache status badge (cached vs fresh extraction)
- Show PDF version if available
- Show image count if available
- Display full content_summary in collapsible section

### 5. Added Debug Logging
**Feature:** Console logging for easier troubleshooting
```javascript
console.log(`[${type}] API Response:`, data)
```

This helps developers verify API responses in browser console.

---

## Testing Checklist

After reloading the frontend, verify:

### Summary Tab
- [ ] Upload a document
- [ ] Select it from dropdown
- [ ] Click "Get Summary"
- [ ] Verify stats show correct numbers (not 0s)
- [ ] Check "Total Pages" displays correctly
- [ ] Check "Sections" displays correctly
- [ ] Check "Tables" displays correctly
- [ ] Verify "Cached" badge shows after first extraction

### Pages Tab
- [ ] Set page range (e.g., 1 to 3)
- [ ] Click "Extract Pages"
- [ ] Verify page content displays
- [ ] Check page dimensions show
- [ ] Verify character count badge

### Sections Tab
- [ ] Click "Extract Sections"
- [ ] Verify sections display with hierarchy
- [ ] Check section levels show correctly
- [ ] Verify page numbers display

### Tables Tab
- [ ] Click "Extract Tables"
- [ ] Verify table headers display in bold
- [ ] Check table data displays in rows
- [ ] Verify row/column count shows
- [ ] Check page numbers display

### Full JSON Tab
- [ ] Click "Full JSON"
- [ ] Verify JSON viewer shows expandable tree
- [ ] Test expand/collapse functionality
- [ ] Try "Copy JSON" button

### Search Tab
- [ ] Enter a search query
- [ ] Click "Search"
- [ ] Verify results show with highlighting
- [ ] Check context before/after match displays

---

## Files Modified

1. **`frontend/src/pages/ExtractionPage.jsx`**
   - Fixed `renderSummary()` - corrected data path access
   - Fixed `renderPages()` - changed to `extracted_pages` with `content`
   - Fixed `renderTables()` - changed to `headers` and `rows`
   - Added debug console logging
   - Enhanced metadata display

---

## API Response Structure Reference

### Summary Response
```json
{
  "file_id": "string",
  "cached": true,
  "extraction_timestamp": "2026-01-16T12:00:00",
  "metadata": {
    "total_pages": 45,
    "pdf_version": "1.7"
  },
  "content_summary": {
    "total_sections": 12,
    "total_tables": 8,
    "total_images": 5
  }
}
```

### Pages Response
```json
{
  "file_id": "string",
  "total_pages": 45,
  "extracted_pages": [
    {
      "page_number": 1,
      "content": "Page text...",
      "page_height": 792,
      "page_width": 612
    }
  ]
}
```

### Sections Response
```json
{
  "file_id": "string",
  "sections": [
    {
      "section_id": "s1",
      "title": "Introduction",
      "level": 0,
      "content": "Section text..."
    }
  ],
  "total_sections": 12
}
```

### Tables Response
```json
{
  "file_id": "string",
  "tables": [
    {
      "table_id": "t1",
      "title": "Table 1",
      "headers": ["Name", "Value"],
      "rows": [["Row1", "Val1"], ["Row2", "Val2"]],
      "page_number": 5
    }
  ],
  "total_tables": 8
}
```

---

## Next Steps

1. **Reload Frontend:** Refresh browser or restart dev server
2. **Test All Features:** Go through testing checklist above
3. **Check Console:** Open browser DevTools to see debug logs
4. **Report Issues:** If any new issues found, check console for error details

---

## How to Debug Further

If you still see issues:

1. **Open Browser Console** (F12 → Console tab)
2. **Look for logs:**
   ```
   [summary] API Response: { ... }
   ```
3. **Check the actual structure** of the data
4. **Compare with expected structure** above
5. **Report the actual structure** if it differs

The console logs will show exactly what the API is returning, making it easy to spot any remaining mismatches.
