# Frontend Setup & Installation Guide

## Quick Start (If Node.js is Already Installed)

If you already have Node.js 16+ installed:

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000 in your browser.

---

## Installation from Scratch

### Step 1: Install Node.js

#### On RHEL/CentOS/Fedora (Your System):
```bash
# Install Node.js 20.x (LTS)
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node -v   # Should show v20.x.x
npm -v    # Should show 10.x.x
```

#### On Ubuntu/Debian:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Alternative - Using Conda (Recommended if you use conda):
```bash
conda install -c conda-forge nodejs
```

### Step 2: Install Frontend Dependencies

```bash
cd /home/test1/vamshi/frontend
npm install
```

This will install:
- React 18
- React Router 6
- Axios (API client)
- Tailwind CSS
- Vite (build tool)
- React Hot Toast (notifications)
- Lucide React (icons)

### Step 3: Start Development Server

```bash
npm run dev
```

The application will start on http://localhost:3000

---

## Automated Setup

You can use the automated setup script:

```bash
cd /home/test1/vamshi/frontend
chmod +x setup.sh
./setup.sh
```

This script will:
1. Check if Node.js is installed
2. Install Node.js if needed (requires sudo)
3. Install all npm dependencies
4. Provide startup instructions

---

## Manual Setup (Without Script)

### 1. Install Node.js Manually

Download from: https://nodejs.org/

Or use your system's package manager:
- **RHEL/CentOS**: `sudo yum install nodejs`
- **Fedora**: `sudo dnf install nodejs`
- **Ubuntu/Debian**: `sudo apt install nodejs npm`

### 2. Install Dependencies

```bash
cd /home/test1/vamshi/frontend
npm install
```

### 3. Configure API Endpoint (Optional)

If your FastAPI backend is not on http://localhost:8000, create a `.env` file:

```bash
# frontend/.env
VITE_API_BASE_URL=http://your-backend-url:port
```

### 4. Start Development Server

```bash
npm run dev
```

---

## Running Both Backend & Frontend

### Terminal 1 - Backend (FastAPI):
```bash
cd /home/test1/vamshi
# Activate your Python environment if needed
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```

### Terminal 2 - Frontend (React):
```bash
cd /home/test1/vamshi/frontend
npm run dev
```

Then access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Production Build

To create a production build:

```bash
cd /home/test1/vamshi/frontend
npm run build
```

The optimized files will be in `frontend/dist/`

To preview the production build:
```bash
npm run preview
```

---

## Troubleshooting

### "npm: command not found"
- Node.js is not installed or not in PATH
- Install Node.js using one of the methods above

### "CORS Error" in Browser Console
- Your FastAPI backend needs CORS configuration
- This should already be set up in `api/main.py`
- Verify CORS allows `http://localhost:3000`

### "Network Error" or "Connection Refused"
- Make sure FastAPI backend is running on port 8000
- Check: `curl http://localhost:8000/docs`
- Verify proxy configuration in `frontend/vite.config.js`

### Port 3000 Already in Use
- Change port in `vite.config.js`:
  ```js
  server: {
    port: 3001, // or any other port
  }
  ```

### Dependencies Installation Fails
- Clear cache and try again:
  ```bash
  rm -rf node_modules package-lock.json
  npm cache clean --force
  npm install
  ```

---

## Project Structure

```
frontend/
├── src/
│   ├── api/                 # API integration layer
│   │   ├── client.js       # Axios configuration
│   │   ├── documents.js    # Document endpoints
│   │   ├── extraction.js   # Extraction endpoints
│   │   └── embedding.js    # Embedding endpoints
│   ├── components/         # Reusable UI components
│   │   ├── Layout.jsx      # Main layout with nav
│   │   └── JSONViewer.jsx  # JSON viewer component
│   ├── pages/             # Page components
│   │   ├── DocumentsPage.jsx
│   │   ├── ExtractionPage.jsx
│   │   └── EmbeddingPage.jsx
│   ├── App.jsx            # Root component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── package.json           # Dependencies
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS config
└── README.md             # Documentation
```

---

## Available Scripts

- `npm run dev` - Start development server (hot reload)
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint (if configured)

---

## Features

### Documents Page
- ✅ Upload PDF documents
- ✅ View all documents with metadata
- ✅ Delete documents
- ✅ View detailed document info

### Extraction Page
- ✅ Get document summary (pages, sections, tables count)
- ✅ Extract specific pages or ranges
- ✅ Extract all sections with hierarchy
- ✅ Extract all tables with data
- ✅ Search text with context highlighting
- ✅ View full JSON with interactive viewer

### Embedding Page
- ✅ Compute text similarity
- ✅ Multiple metrics (cosine, euclidean, dot product)
- ✅ Visual similarity score
- ✅ Real-time computation

### Comparison Page
- ⏳ Coming in next phase (as per your request)

---

## Next Steps

After setup is complete:

1. **Start Backend**: 
   ```bash
   cd /home/test1/vamshi
   uvicorn api.main:app --reload
   ```

2. **Start Frontend**:
   ```bash
   cd /home/test1/vamshi/frontend
   npm run dev
   ```

3. **Test the Application**:
   - Upload a PDF document
   - Extract content in different formats
   - Try text search
   - Compute text similarity

4. **Comparison UI** (Future):
   - We'll implement this once you're ready
   - Will include all 4 comparison modes
   - Visual diff display
   - Side-by-side comparison view

---

## Support

If you encounter any issues:

1. Check that both backend and frontend are running
2. Verify Node.js version: `node -v` (should be 16+)
3. Check browser console for errors (F12)
4. Review backend logs for API errors
5. Ensure CORS is properly configured

For comparison UI implementation, let me know when you're ready and we'll add:
- Document selection for comparison
- Comparison mode selection
- Results visualization
- Diff viewer
