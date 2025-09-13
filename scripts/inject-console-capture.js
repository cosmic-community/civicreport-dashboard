const fs = require('fs');
const path = require('path');

const scriptTag = '<script src="/dashboard-console-capture.js"></script>';

function injectScript(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('dashboard-console-capture.js')) {
      console.log(`Script already injected in ${filePath}`);
      return;
    }
    
    // Try to inject before closing head tag
    if (content.includes('</head>')) {
      content = content.replace('</head>', `${scriptTag}\n</head>`);
    } 
    // Or before closing body tag as fallback
    else if (content.includes('</body>')) {
      content = content.replace('</body>', `${scriptTag}\n</body>`);
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Script injected into ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// For Next.js apps, inject into the built HTML files
const outDir = path.join(process.cwd(), '.next');
const staticDir = path.join(process.cwd(), 'out');

function findHtmlFiles(dir) {
  const htmlFiles = [];
  
  if (!fs.existsSync(dir)) {
    return htmlFiles;
  }
  
  function walk(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    files.forEach(file => {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walk(filePath);
      } else if (file.endsWith('.html')) {
        htmlFiles.push(filePath);
      }
    });
  }
  
  walk(dir);
  return htmlFiles;
}

// Check both .next and out directories
[outDir, staticDir].forEach(dir => {
  const files = findHtmlFiles(dir);
  files.forEach(injectScript);
});

console.log('Console capture script injection complete');