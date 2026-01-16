# Document Management & Extraction - React Frontend

A modern React application for managing documents and extracting content using FastAPI backend.

## Features

- **Document Management**: Upload, view, and delete PDF documents
- **Content Extraction**: Extract pages, sections, tables, and full JSON from documents
- **Text Search**: Search for text within documents with context
- **Semantic Embeddings**: Compute text similarity using BAAI/bge-m3 embeddings
- **Modern UI**: Built with React 18, Tailwind CSS, and Vite

## Prerequisites

- Node.js 16+ and npm
- FastAPI backend running on `http://localhost:8000`

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── api/              # API client and endpoints
│   │   ├── client.js     # Axios configuration
│   │   ├── documents.js  # Document API calls
│   │   ├── extraction.js # Extraction API calls
│   │   └── embedding.js  # Embedding API calls
│   ├── components/       # Reusable components
│   │   ├── Layout.jsx    # Main layout with navigation
│   │   └── JSONViewer.jsx# Interactive JSON viewer
│   ├── pages/           # Page components
│   │   ├── DocumentsPage.jsx
│   │   ├── ExtractionPage.jsx
│   │   └── EmbeddingPage.jsx
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Usage

### Documents Page
- Upload PDF documents
- View list of uploaded documents
- View document information
- Delete documents

### Extraction Page
- Select a document
- Get extraction summary (pages, sections, tables count)
- Extract specific pages or page ranges
- Extract all sections with hierarchy
- Extract all tables
- Search for text with context
- View full JSON extraction

### Embedding Page
- Enter two texts to compare
- Choose similarity metric (cosine, euclidean, dot product)
- Get similarity score and visualization

## API Configuration

The frontend is configured to proxy API requests to `http://localhost:8000`. If your backend is running on a different URL, update the `VITE_API_BASE_URL` in `.env`:

```bash
VITE_API_BASE_URL=http://your-backend-url:port
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technologies Used

- **React 18**: Modern React with hooks
- **React Router 6**: Client-side routing
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **React Hot Toast**: Beautiful toast notifications
- **Lucide React**: Beautiful icon library

## Features Overview

### Document Management
- Drag & drop file upload
- File size display
- Upload date tracking
- Quick delete with confirmation
- Document info modal

### Extraction
- Multiple extraction modes
- Interactive JSON viewer with expand/collapse
- Color-coded statistics
- Page range selection
- Text search with highlighting

### Embedding
- Real-time similarity computation
- Visual similarity score
- Multiple metric support
- Color-coded results

## Development

To contribute or modify:

1. Make changes in `src/` directory
2. Hot reload will automatically update the browser
3. Build for production before deploying

## Troubleshooting

**CORS Issues**: Make sure your FastAPI backend has CORS enabled for `http://localhost:3000`

**API Connection**: Verify the backend is running on `http://localhost:8000`

**Build Errors**: Clear `node_modules` and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Future Enhancements

- Comparison UI (planned for next phase)
- Document preview
- Batch operations
- Advanced search filters
- Export capabilities
# frontend
