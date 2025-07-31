# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a CV/resume generation tool that converts HJSON data files into HTML and PDF formats. It supports two types of output:
- **Preview CVs**: For general use with warning text
- **Authorized CVs**: For specific recruiters/clients with GPG-signed authorization

The system uses JSON Resume schema with HJSON (human-friendly JSON) for easier editing, and includes cryptographic signing capabilities to prevent misrepresentation.

## Core Architecture

- **buildcv.js**: Main CLI application using Commander.js with three commands:
  - `generate-preview`: Creates preview CV with warning footer
  - `generate-auth`: Creates authorized CV for specific recruiter/client with GPG signature
  - `open`: Opens generated files
- **input/**: Contains source data (`resume.hjson`) and profile image (`profile.jpg`)
- **output/**: Generated files including HTML, PDF, JSON, and authorization files
- **templates/**: Text templates for headers, footers, warnings, and authorization messages

## Key Commands

### Build and Generate
```bash
# Generate preview CV
./buildcv.js generate-preview
# or
npm run buildcv generate-preview

# Generate authorized CV for specific recruiter/client
./buildcv.js generate-auth --recruiter "Company Name" --end-client "Client Name"

# Use specific GPG key for signing
./buildcv.js generate-auth --recruiter "Company Name" --end-client "Client Name" --gpg-key "key@example.com"
```

### Development Workflows
```bash
# Setup dependencies (requires sudo for system packages)
./setup.sh

# Watch for changes and auto-regenerate preview
./watch.sh

# Build and open preview files
./preview.sh

# Verify GPG signature on authorization
./verify.sh
```

## Data Flow

1. **Input**: `input/resume.hjson` (HJSON format) + `input/profile.jpg`
2. **Processing**: 
   - Parse HJSON to JSON Resume schema
   - Apply appropriate template (preview vs authorized)
   - For authorized: Generate auth code, sign with GPG, embed signature
3. **Output**: HTML (using jsonresume-theme-kendall), PDF (via Puppeteer), JSON

## Template System

Templates in `templates/` directory are text files with placeholder replacement:
- `CLIENT_NAME`, `END_CLIENT`: Replaced with command line arguments
- `DATE`, `EXPIRY`, `AUTH_CODE`: Generated dynamically
- Templates are concatenated with original CV summary content

## Dependencies

- **Runtime**: Node.js with ES modules
- **Core libs**: hjson, resumed, jsonresume-theme-kendall, puppeteer, commander
- **System**: GPG for signing, inotify-tools for watching, pandoc/texlive for setup

## File Structure Notes

- All generated files include date stamps in filenames
- Authorized CVs include sanitized recruiter/client names in filenames  
- Authorization log maintained in CSV format at `output/auth-log.csv`
- Profile image is copied to output directory for HTML embedding