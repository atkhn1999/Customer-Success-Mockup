# Customer Success Plan - Local Deployment Package

This package contains a self-contained version of the Customer Success Plan application that can be hosted locally at your workplace without requiring internet connectivity.

## Package Contents

- `index.html` - Main application file
- `*.html` - Additional application pages
- `js/` - JavaScript libraries (Tailwind CSS, jsPDF, html2canvas, xlsx)
- `css/` - Stylesheets including fonts
- `server.py` - Python HTTP server for local hosting
- `server.js` - Node.js HTTP server (alternative)
- `package.json` - npm configuration for easy setup

## Quick Start

### Option 1: Using Python (Recommended)

1. Ensure Python 3 is installed on your system
2. Open a terminal/command prompt in this directory
3. Run the server:
   ```bash
   python server.py
   ```
   Or specify a custom port:
   ```bash
   python server.py 3000
   ```
4. Open your browser and navigate to: `http://localhost:8080/index.html`

### Option 2: Using Node.js

1. Ensure Node.js is installed on your system
2. Open a terminal/command prompt in this directory
3. Install dependencies (first time only):
   ```bash
   npm install
   ```
4. Run the server:
   ```bash
   npm start
   ```
   Or with a custom port:
   ```bash
   node server.js 3000
   ```
5. Open your browser and navigate to: `http://localhost:8080/index.html`

### Option 3: Using Any Web Server

This package can be hosted on any web server (Apache, Nginx, IIS, etc.):

1. Copy all files to your web server's document root
2. Ensure the web server serves the files with appropriate MIME types
3. Access the application through your web server's URL

### Option 4: Direct File Access (Limited Functionality)

While not recommended due to browser security restrictions, you can:
1. Open the `index.html` file directly in a web browser
2. Note: Some features may not work due to CORS restrictions

## System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- For local server:
  - Python 3.x OR Node.js 12+
  - Available port (default: 8080)

## Features

- **Fully Offline**: All dependencies are included locally
- **No Internet Required**: Works completely offline once deployed
- **Data Privacy**: All data stays on your local machine
- **Export Capabilities**: Export plans as PDF or Excel files
- **Responsive Design**: Works on desktop and mobile devices

## Security Considerations

- The included servers are for development/internal use only
- For production deployment, use a proper web server with security configurations
- Consider implementing authentication if hosting on a network
- All data is stored in browser localStorage (not on server)

## Customization

### Changing the Default Port
- Python: `python server.py [port_number]`
- Node.js: `node server.js [port_number]`

### Font Support
The application uses the Inter font with system font fallbacks. If Inter is not installed on your system, it will automatically use system fonts.

## Troubleshooting

### Port Already in Use
If you see an error about the port being in use:
1. Try a different port: `python server.py 3000`
2. Or find and stop the process using port 8080

### JavaScript Errors
Ensure all files in the `js/` directory are present and not corrupted.

### Styling Issues
Verify that Tailwind CSS is loaded correctly by checking the browser console.

### Font Display Issues
The application will work with system fonts if Inter is not available.

## Data Management

- All data is stored in browser localStorage
- Use the Export/Import features to backup your data
- Clear browser data/cache to reset the application

## Support Files Included

- Multiple test HTML files for different features
- Sample data file: `sample-backup.json`
- Platform review documentation: `platform-review.md`

## License

Please refer to your organization's licensing agreements for the included third-party libraries:
- Tailwind CSS
- jsPDF
- html2canvas
- SheetJS (xlsx)

---

For additional help or issues, please contact your IT department.