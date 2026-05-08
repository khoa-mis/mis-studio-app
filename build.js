const fs = require('fs');
const path = require('path');

const distDir = 'dist';

// Clean/create dist
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy all files except ignored ones
const ignore = new Set([
  'dist', 'node_modules', '.git', 'build.js',
  '.env', '.env.local', '.env.production',
  'package.json', 'package-lock.json'
]);

const files = fs.readdirSync('.');
for (const file of files) {
  if (ignore.has(file)) continue;
  const stat = fs.statSync(file);
  const dest = path.join(distDir, file);
  if (stat.isDirectory()) {
    fs.cpSync(file, dest, { recursive: true });
  } else {
    fs.copyFileSync(file, dest);
  }
}

// Replace env placeholders in HTML files
const env = {
  '__SUPABASE_URL__':       process.env.SUPABASE_URL       || '',
  '__SUPABASE_ANON_KEY__':  process.env.SUPABASE_ANON_KEY  || '',
  '__GOOGLE_CLIENT_ID__':   process.env.GOOGLE_CLIENT_ID   || '',
};

const htmlFiles = ['trackr.html', 'pay.html', 'grow.html', 'index.html'];
for (const file of htmlFiles) {
  const filePath = path.join(distDir, file);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [placeholder, value] of Object.entries(env)) {
    content = content.split(placeholder).join(value);
  }
  fs.writeFileSync(filePath, content);
}

console.log('Build complete → dist/');
