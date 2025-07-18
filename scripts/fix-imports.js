#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');

// Function to recursively find all .js files
function findJsFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory ${dir} does not exist, skipping...`);
    return [];
  }
  
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findJsFiles(fullPath));
    } else if (item.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to fix imports in a file
function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // Fix relative shared imports
  const sharedImportRegex = /from ["']\.\.\/shared\/schema["']/g;
  if (sharedImportRegex.test(content)) {
    content = content.replace(sharedImportRegex, 'from "../shared/schema.js"');
    modified = true;
    console.log(`Fixed shared import in: ${path.relative(distDir, filePath)}`);
  }
  
  // Fix vite.config imports
  const viteConfigRegex = /from ["']\.\.\/vite\.config["']/g;
  if (viteConfigRegex.test(content)) {
    content = content.replace(viteConfigRegex, 'from "../vite.config.js"');
    modified = true;
    console.log(`Fixed vite.config import in: ${path.relative(distDir, filePath)}`);
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
  }
}

console.log('🔧 Fixing ES module imports...');

// Find all JavaScript files in dist directory
const jsFiles = findJsFiles(distDir);

// Fix imports in each file
jsFiles.forEach(fixImports);

console.log('✅ Import fixes completed!');
