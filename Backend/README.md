# LawFort Backend Setup Guide

## Prerequisites
- MySQL 8.0 or higher
- Python 3.8 or higher
- At least 1GB free disk space

## Quick Setup (3 Steps Only!)

### 1. Database Setup
```bash
# Create database and import complete schema with data
mysql -u root -p < lawfortdb.sql
```

### 2. Environment Configuration
Create a `.env` file in the Backend directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=lawfort
DB_POOL_SIZE=5
SECRET_KEY=your_secret_key_here
```

### 3. Install Dependencies & Start
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
python app.py
```

The backend will be available at `http://localhost:5000`

## ✅ What the SQL File Includes
The `lawfortdb.sql` file is **complete and self-contained**:
- ✅ All database tables and relationships
- ✅ All stored procedures and functions
- ✅ Default admin user and roles
- ✅ Sample data for testing
- ✅ Proper indexes and constraints

**No additional setup scripts needed!**

## Default Admin Account

After running the database setup, you'll have a default admin account for initial system access:

### 🔐 Default Credentials:
- **Email:** `admin@lawfort.com`
- **Password:** `admin123`

### ⚠️ IMPORTANT SECURITY NOTES:
1. **Change the default password immediately** after first login
2. The admin account has full system privileges including:
   - User management and role assignment
   - Content moderation and management
   - System configuration access
   - Access request approval/denial
3. The password is securely hashed using bcrypt
4. Consider creating additional admin users and disabling the default account

### Additional Test Accounts:
- **Editor**: `editor@lawfort.com` / `editor123`

### Creating Additional Admin Users:
Use the admin dashboard or directly insert into the database with proper password hashing.

## API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /user/validate_session` - Validate session token
- `GET /user/profile` - Get user profile

### User Management
- `POST /request_editor_access` - Request editor access

### Admin Functions
- `GET /admin/access_requests` - Get pending access requests
- `POST /admin/approve_deny_access` - Approve/deny access requests

## Database Schema

### Tables Created:
- `Roles` - User roles (Admin, Editor, User)
- `Users` - User accounts
- `User_Profile` - User profile information
- `Access_Request` - Editor access requests
- `Session` - User sessions
- `Audit_Logs` - Admin action logs
- `OAuth_Providers` - OAuth authentication data

## Troubleshooting

### Connection Issues
1. Check your MySQL server is running
2. Verify database credentials in `.env` file
3. Ensure the `lawfort` database was created successfully

### Import Issues
If the SQL import fails:
1. Ensure MySQL is running and accessible
2. Check that you have sufficient privileges
3. Verify the `lawfortdb.sql` file is complete and not corrupted

### CORS Issues
The backend includes CORS headers for development. For production, configure CORS properly.

## Development Notes

- Passwords are hashed using bcrypt
- Session tokens are UUIDs stored in the database
- Role-based access control is implemented
- All API responses are in JSON format

## Production Deployment

For production deployment:
1. Use environment variables for all sensitive data
2. Configure proper CORS settings
3. Use a production WSGI server (gunicorn, uWSGI)
4. Set up proper database connection pooling
5. Enable SSL/HTTPS
6. Configure proper logging

# Installing Poppler for Windows - PDF Thumbnail Generation

## Quick Installation Guide

To enable actual PDF page thumbnails (instead of placeholders), you need to install Poppler on Windows.

### Option 1: Download Pre-built Binaries (Recommended)

1. **Download Poppler for Windows:**
   - Go to: https://github.com/oschwartz10612/poppler-windows/releases/latest
   - Download: `poppler-24.08.0_x86_64.zip` (or latest version)

2. **Extract and Install:**
   ```
   1. Extract the zip file to: C:\poppler\
   2. Add C:\poppler\bin to your Windows PATH environment variable
   3. Restart your command prompt/terminal
   ```

3. **Add to Windows PATH:**
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Click "Environment Variables"
   - Under "System Variables", find and select "Path", click "Edit"
   - Click "New" and add: `C:\poppler\bin`
   - Click "OK" to save

### Option 2: Local Installation (Project-specific)

1. **Download and extract to project:**
   ```
   1. Download poppler-24.08.0_x86_64.zip
   2. Extract to: Backend/poppler/
   3. The structure should be: Backend/poppler/bin/pdftoppm.exe
   ```

2. **Create config file:**
   Create `Backend/poppler_config.py`:
   ```python
   # Poppler configuration for Windows
   import os
   
   POPPLER_PATH = os.path.join(os.path.dirname(__file__), "poppler", "bin")
   ```

### Option 3: Using Conda (If you have Anaconda/Miniconda)

```bash
conda install -c conda-forge poppler
```

## Testing the Installation

1. **Restart your Flask server** after installing poppler
2. **Upload a new research paper** through the frontend
3. **Check the thumbnail** - it should now show the actual first page of the PDF

## Troubleshooting

### If thumbnails still show placeholders:

1. **Check server logs** for poppler-related errors
2. **Verify poppler installation:**
   ```bash
   pdftoppm -h
   ```
   This should show help text if poppler is properly installed.

3. **Check file permissions** - ensure the uploads directory is writable

### Common Issues:

- **"Unable to get page count"** - Poppler not in PATH or not installed
- **"Permission denied"** - Check file/folder permissions
- **"Module not found"** - Restart Flask server after installation

## Current Fallback Behavior

Without poppler, the system generates placeholder thumbnails that simulate research paper layout with:
- Paper-like white background
- Simulated title and abstract text
- Professional academic paper appearance
- PDF indicator badge

With poppler installed, you'll get actual PDF page thumbnails showing the real content of the research papers.

# PDF Thumbnail Generation System

This document describes the automated PDF thumbnail generation system implemented for research paper cards in the LawFort project.

## Overview

The system automatically generates thumbnail images from the first page of uploaded PDF research papers and displays them on research paper cards in the UI.

## Features

- **Automatic thumbnail generation**: When a PDF is uploaded, the system extracts the first page and converts it to a thumbnail image
- **Multiple fallback methods**: Uses pdf2image for high-quality thumbnails, falls back to PyPDF2 + PIL for placeholder generation
- **Error handling**: Graceful fallback to default placeholder when thumbnail generation fails
- **Optimized thumbnails**: Generated thumbnails are 400x300px JPEG images optimized for web display
- **Database integration**: Thumbnail URLs are stored in the database alongside research paper records

## Implementation Details

### Backend Changes

1. **New Dependencies**:
   - `Pillow==10.0.1` - Image processing
   - `pdf2image==1.16.3` - PDF to image conversion

2. **Database Schema**:
   - Added `Thumbnail_URL` column to `Content` table
   - Stores the URL of the generated thumbnail image

3. **New Files**:
   - `utils/pdf_thumbnail.py` - PDF thumbnail generation utility
   - `add_thumbnail_column.sql` - Database migration script

4. **Modified Files**:
   - `app.py` - Updated PDF upload endpoints to generate thumbnails
   - `requirements.txt` - Added new dependencies
   - `lawfortdb.sql` - Updated schema with Thumbnail_URL column

### Frontend Changes

1. **Updated Types**:
   - `ResearchPaper` interface now includes `thumbnail_url` field
   - API methods updated to handle thumbnail URLs

2. **Modified Components**:
   - Research paper cards now display thumbnail images
   - PDF upload forms store and submit thumbnail URLs
   - Fallback to placeholder icon when thumbnail is not available

## File Structure

```
Backend/
├── utils/
│   ├── __init__.py
│   └── pdf_thumbnail.py          # PDF thumbnail generation utility
├── uploads/
│   ├── research_papers/          # PDF files
│   └── thumbnails/
│       └── research_papers/      # Generated thumbnail images
├── add_thumbnail_column.sql      # Database migration
├── migrate_add_thumbnail_url.py  # Python migration script
├── test_thumbnail.py             # Test script for thumbnail generation
└── test_upload.py                # Test script for PDF upload

Frontend/
├── src/
│   ├── services/api.ts           # Updated API types and methods
│   └── pages/content/
│       ├── ResearchPapers.tsx    # Updated to display thumbnails
│       ├── CreateEditResearchPaper.tsx  # Updated to handle thumbnails
│       └── SubmitResearchPaper.tsx      # Updated to handle thumbnails
```

## API Endpoints

### PDF Upload Endpoints
- `POST /api/research-papers/upload-pdf` - Upload PDF for research papers
- `POST /api/research-papers/submit/upload-pdf` - Upload PDF for submissions

**Response includes**:
```json
{
  "success": true,
  "file_url": "http://localhost:5000/uploads/research_papers/filename.pdf",
  "thumbnail_url": "http://localhost:5000/uploads/thumbnails/research_papers/thumbnail.jpg",
  "thumbnail_generated": true
}
```

### Thumbnail Serving
- `GET /uploads/thumbnails/research_papers/<filename>` - Serve thumbnail images

## Installation & Setup

### 1. Install Dependencies
```bash
cd Backend
pip install Pillow==10.0.1 pdf2image==1.16.3
```

### 2. Database Migration
Run the SQL migration to add the Thumbnail_URL column:
```sql
-- Execute the contents of add_thumbnail_column.sql in your MySQL database
```

Or use the Python migration script:
```bash
python migrate_add_thumbnail_url.py
```

### 3. Directory Structure
The system will automatically create the required directories:
- `uploads/thumbnails/research_papers/`

## Testing

### 1. Test Thumbnail Generation
```bash
python test_thumbnail.py
```

### 2. Test PDF Upload (requires valid session token)
```bash
python test_upload.py
```

### 3. Manual Testing
1. Start the Flask server: `python app.py`
2. Login to the frontend
3. Navigate to Research Papers → Create New
4. Upload a PDF file
5. Check that thumbnail is generated and displayed on the research papers page

## Configuration

### Thumbnail Settings
You can modify thumbnail settings in `utils/pdf_thumbnail.py`:
- `thumbnail_width`: Default 400px
- `thumbnail_height`: Default 300px
- `quality`: JPEG quality (1-100), default 85

### Error Handling
The system includes multiple fallback mechanisms:
1. **pdf2image**: High-quality PDF to image conversion
2. **PyPDF2 + PIL**: Fallback with placeholder generation
3. **Default placeholder**: FileText icon when all else fails

## Troubleshooting

### Common Issues

1. **pdf2image not working**: 
   - Ensure poppler-utils is installed on your system
   - The system will fallback to PyPDF2 method automatically

2. **Permission errors**:
   - Ensure the uploads directory is writable
   - Check file permissions on generated thumbnails

3. **Database errors**:
   - Ensure the Thumbnail_URL column exists in the Content table
   - Run the migration script if needed

4. **Thumbnail not displaying**:
   - Check browser console for 404 errors
   - Verify thumbnail file exists in uploads/thumbnails/research_papers/
   - Check CORS headers are properly set

### Logs
Check the Flask server logs for thumbnail generation status:
- Success: "Thumbnail generated successfully using pdf2image"
- Fallback: "pdf2image not available, falling back to PyPDF2 method"
- Error: "Error generating thumbnail: [error message]"

## Future Enhancements

- **Async processing**: Move thumbnail generation to background tasks for large PDFs
- **Multiple sizes**: Generate thumbnails in different sizes for different use cases
- **Caching**: Implement thumbnail caching to avoid regeneration
- **Batch processing**: Add ability to regenerate thumbnails for existing PDFs
- **Preview**: Add thumbnail preview in upload forms
# Manual Poppler Installation for Windows

## Quick Fix for PDF Thumbnails

Your research paper cards are currently showing placeholders instead of actual PDF content because poppler is not installed. Here's how to fix it:

### Step 1: Download Poppler
1. Go to: https://github.com/oschwartz10612/poppler-windows/releases/latest
2. Download: `poppler-24.08.0_x86_64.zip` (for 64-bit Windows)

### Step 2: Extract and Install
1. Extract the downloaded zip file
2. Copy the extracted folder to: `C:\poppler\`
3. The structure should look like: `C:\poppler\bin\pdftoppm.exe`

### Step 3: Add to Windows PATH
1. Press `Win + R`, type `sysdm.cpl`, press Enter
2. Click "Environment Variables" button
3. Under "System Variables", find and select "Path", click "Edit"
4. Click "New" and add: `C:\poppler\bin`
5. Click "OK" to save all dialogs

### Step 4: Restart Flask Server
1. Stop your current Flask server (Ctrl+C in the terminal)
2. Start it again: `python app.py`

### Step 5: Test
1. Upload a new research paper through your frontend
2. The thumbnail should now show the actual first page of the PDF!

## Alternative: Project-Local Installation

If you don't want to modify system PATH:

1. Extract poppler to: `Backend\poppler\`
2. Create file `Backend\poppler_config.py` with this content:
```python
import os
POPPLER_PATH = os.path.join(os.path.dirname(__file__), "poppler", "bin")
```
3. Restart Flask server

## Verification

After installation, you should see in your Flask server logs:
- Instead of: `pdf2image failed: Unable to get page count. Is poppler installed and in PATH?`
- You should see: `Thumbnail generated successfully using pdf2image`

## Troubleshooting

### If it still doesn't work:
1. Open Command Prompt and type: `pdftoppm -h`
   - If you see help text, poppler is installed correctly
   - If you see "command not found", PATH is not set correctly

2. Check Flask server logs for error messages

3. Make sure you restarted the Flask server after installation

### Common Issues:
- **Forgot to restart Flask server** - This is the most common issue!
- **PATH not set correctly** - Make sure `C:\poppler\bin` is in your system PATH
- **Wrong architecture** - Make sure you downloaded the x86_64 version for 64-bit Windows

## Expected Result

After successful installation:
- New research paper uploads will show actual PDF page thumbnails
- Existing research papers will still show placeholders (they need to be re-uploaded)
- The thumbnails will look like the reference image you showed me

## Quick Test

To test if poppler is working, try this in Command Prompt:
```cmd
pdftoppm -h
```

If you see help text, poppler is installed correctly!
# Grammar Checker Setup Guide

This guide explains how to set up and use the LanguageTool-based grammar checker for the LawFort MinimalBlogWriter.

## Prerequisites

- Python 3.7 or higher
- pip package manager
- Internet connection (for initial LanguageTool download)

## Installation

### Option 1: Automatic Installation

Run the installation script:

```bash
cd Backend
python install_dependencies.py
```

### Option 2: Manual Installation

Install the required packages manually:

```bash
pip install language-tool-python==2.7.1
pip install Flask==2.3.3
pip install Flask-CORS==4.0.0
# ... other dependencies from requirements.txt
```

### Option 3: Using requirements.txt

```bash
cd Backend
pip install -r requirements.txt
```

## Testing the Grammar Checker

### Run the Test Suite

```bash
cd Backend
python test_grammar_checker.py
```

This will test:
- Basic grammar checking functionality
- API function integration
- Edge cases and error handling

### Manual Testing

You can also test the grammar checker manually:

```python
from grammar_checker import GrammarChecker

checker = GrammarChecker()
issues = checker.check_text("This are a test sentence with grammar error.")
print(f"Found {len(issues)} issues")

for issue in issues:
    print(f"- {issue.message}")
    print(f"  Suggestions: {issue.replacements}")

checker.close()
```

## Usage in Flask Application

The grammar checker is integrated into the Flask app with these endpoints:

### Check Grammar
```
POST /api/grammar/check
Content-Type: application/json

{
  "text": "Your text to check for grammar issues."
}
```

### Apply Suggestion
```
POST /api/grammar/apply-suggestion
Content-Type: application/json

{
  "text": "Original text",
  "offset": 0,
  "length": 4,
  "replacement": "corrected text"
}
```

### Health Check
```
GET /api/grammar/health
```

## Frontend Integration

The grammar checker is integrated into the MinimalBlogWriter component:

1. **Enable Grammar Check**: Click the "G" button in the editor header
2. **View Issues**: Grammar issues appear in a side panel
3. **Apply Fixes**: Click suggestion buttons to apply corrections
4. **Auto-checking**: Grammar is checked automatically as you type (with 2-second delay)

## Configuration

### Language Settings

By default, the grammar checker uses English (US). To change the language:

```python
# In grammar_checker.py
checker = GrammarChecker(language='en-GB')  # British English
# or
checker = GrammarChecker(language='de-DE')  # German
```

### Performance Tuning

For better performance with large texts:

1. **Increase timeout**: Modify the LanguageTool timeout settings
2. **Limit text length**: Add text length limits in the API
3. **Batch processing**: Process text in smaller chunks

## Troubleshooting

### Common Issues

1. **"Match object has no attribute 'shortMessage'"**
   - This is fixed in the current implementation
   - The code now safely handles missing attributes

2. **LanguageTool download fails**
   - Ensure internet connection
   - Try running: `python -c "import language_tool_python; language_tool_python.LanguageTool('en-US')"`

3. **Memory issues with large texts**
   - Limit text length to 10,000 characters
   - Process text in smaller chunks

4. **Slow performance**
   - LanguageTool initialization takes time on first use
   - Consider keeping the checker instance alive
   - Use caching for repeated checks

### Debug Mode

Enable debug logging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Error Logs

Check the Flask console for grammar checker errors:
- Grammar check requests and responses
- LanguageTool initialization status
- Processing errors and warnings

## Features

### Issue Types

The grammar checker categorizes issues into:

- **Grammar**: Subject-verb agreement, tense consistency
- **Spelling**: Misspelled words
- **Punctuation**: Comma splices, missing periods
- **Style**: Wordiness, redundancy
- **Typography**: Spacing, formatting

### Suggestions

- Up to 5 suggestions per issue
- Context-aware corrections
- One-click application

### Statistics

- Total issue count
- Issues by type
- Severity distribution

## Performance Notes

- **First run**: LanguageTool downloads language models (~100MB for English)
- **Subsequent runs**: Much faster as models are cached
- **Memory usage**: ~200-500MB depending on language models
- **Processing speed**: ~1-2 seconds for typical blog posts

## Support

For issues or questions:

1. Check the test suite output
2. Review Flask console logs
3. Verify LanguageTool installation
4. Check network connectivity for initial setup

