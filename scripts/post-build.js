const fs = require('fs');
const path = require('path');

// Define paths
const outDir = path.join(__dirname, '..', 'out');
const indexHtmlPath = path.join(outDir, 'index.html');

// Read the index.html content
let indexHtmlContent = '';
try {
  indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
  console.log('Successfully read index.html');
} catch (error) {
  console.error('Error reading index.html:', error);
  process.exit(1);
}

// Create a modified version for admin pages with a special script
// This script helps ensure client-side routing works correctly for admin routes
const adminHtmlContent = indexHtmlContent.replace(
  '</head>',
  `<script>
    // This script ensures admin routes are handled correctly
    (function() {
      // Check if we're on an admin page
      if (window.location.pathname.includes('/admin')) {
        // Add a class to the html element to indicate we're in admin mode
        document.documentElement.classList.add('admin-route');
        
        // Store the original pushState and replaceState functions
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        // Override pushState to handle admin routes
        history.pushState = function(state, title, url) {
          // Call the original function
          originalPushState.call(this, state, title, url);
          
          // If the URL is an admin route, ensure we stay in the admin context
          if (url && typeof url === 'string' && url.includes('/admin')) {
            document.documentElement.classList.add('admin-route');
            // Force reload if needed to ensure correct rendering
            if (document.querySelector('main') && !document.querySelector('header.bg-white')) {
              window.location.href = url;
            }
          } else {
            document.documentElement.classList.remove('admin-route');
          }
        };
        
        // Override replaceState to handle admin routes
        history.replaceState = function(state, title, url) {
          // Call the original function
          originalReplaceState.call(this, state, title, url);
          
          // If the URL is an admin route, ensure we stay in the admin context
          if (url && typeof url === 'string' && url.includes('/admin')) {
            document.documentElement.classList.add('admin-route');
            // Force reload if needed to ensure correct rendering
            if (document.querySelector('main') && !document.querySelector('header.bg-white')) {
              window.location.href = url;
            }
          } else {
            document.documentElement.classList.remove('admin-route');
          }
        };
      }
    })();
  </script>
  <script>
    // Handle direct navigation to admin pages
    document.addEventListener('DOMContentLoaded', function() {
      if (window.location.pathname.includes('/admin')) {
        // If we're on an admin page but don't see the admin header, reload the page
        setTimeout(function() {
          if (document.querySelector('main') && !document.querySelector('header.bg-white')) {
            window.location.href = window.location.href;
          }
          
          // Handle root admin path
          if (window.location.pathname === '/admin' || window.location.pathname === '/admin/') {
            // Check if user is logged in
            const storedUser = localStorage.getItem('admin_user');
            if (storedUser) {
              window.location.href = '/admin/dashboard';
            } else {
              window.location.href = '/admin/login';
            }
          }
        }, 100);
      }
    });
  </script>
  <script>
    // Fix for admin links
    document.addEventListener('click', function(e) {
      // Find closest anchor tag
      let target = e.target;
      while (target && target.tagName !== 'A') {
        target = target.parentNode;
        if (!target) break;
      }
      
      // If we found an anchor tag with an admin href
      if (target && target.tagName === 'A' && target.href && target.href.includes('/admin')) {
        e.preventDefault();
        
        // Get the href
        const href = target.getAttribute('href');
        
        // Navigate to the href with a full page load to ensure correct rendering
        window.location.href = href;
      }
    }, true);
  </script>
</head>`
);

// Create admin.html in the root directory
const adminHtmlPath = path.join(outDir, 'admin.html');
try {
  fs.writeFileSync(adminHtmlPath, adminHtmlContent);
  console.log('admin.html created successfully with routing enhancements.');
} catch (error) {
  console.error('Error creating admin.html:', error);
  process.exit(1);
}

// Create admin directory if it doesn't exist
const adminDir = path.join(outDir, 'admin');
if (!fs.existsSync(adminDir)) {
  fs.mkdirSync(adminDir, { recursive: true });
}

// Create admin/index.html
const adminIndexHtmlPath = path.join(adminDir, 'index.html');
try {
  fs.writeFileSync(adminIndexHtmlPath, adminHtmlContent);
  console.log('admin/index.html created successfully with routing enhancements.');
} catch (error) {
  console.error('Error creating admin/index.html:', error);
}

// Create subdirectories for admin routes
const adminSubdirs = [
  'dashboard',
  'properties',
  'developers',
  'users',
  'agents',
  'settings',
  'login',
  'inquiries'
];

// Process each admin subdirectory
adminSubdirs.forEach(subdir => {
  const subdirPath = path.join(adminDir, subdir);
  if (!fs.existsSync(subdirPath)) {
    fs.mkdirSync(subdirPath, { recursive: true });
  }
  
  const subdirIndexHtmlPath = path.join(subdirPath, 'index.html');
  try {
    fs.writeFileSync(subdirIndexHtmlPath, adminHtmlContent);
    console.log(`admin/${subdir}/index.html created successfully with routing enhancements.`);
  } catch (error) {
    console.error(`Error creating admin/${subdir}/index.html:`, error);
  }
});

console.log('Post-build processing completed.'); 