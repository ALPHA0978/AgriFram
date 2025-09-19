#!/usr/bin/env node

/**
 * Secure build script for FarmAI Crop Recommendation System
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

console.log('🔒 Starting secure build process for FarmAI...');

// Backup original .env file
const envPath = path.join(projectRoot, '.env');
const envBackupPath = path.join(projectRoot, '.env.backup');

if (fs.existsSync(envPath)) {
  fs.copyFileSync(envPath, envBackupPath);
  console.log('✅ Backed up .env file');
}

try {
  // Create production .env with minimal variables
  const productionEnv = `# Production build - API keys secured
VITE_APP_ENV=production
VITE_BUILD_TIME=${new Date().toISOString()}
`;

  fs.writeFileSync(envPath, productionEnv);
  console.log('✅ Created secure production .env');

  // Run the build
  console.log('🏗️  Building FarmAI application...');
  execSync('npm run build', { stdio: 'inherit', cwd: projectRoot });
  console.log('✅ Build completed successfully');

  // Verify no API keys in build
  const distPath = path.join(projectRoot, 'dist');
  if (fs.existsSync(distPath)) {
    const jsFiles = fs.readdirSync(path.join(distPath, 'assets'))
      .filter(file => file.endsWith('.js'));
    
    let credentialsFound = false;
    jsFiles.forEach(file => {
      const content = fs.readFileSync(path.join(distPath, 'assets', file), 'utf8');
      if (content.includes('hf_') || content.includes('sk-')) {
        console.warn(`⚠️  API credentials found in ${file}`);
        credentialsFound = true;
      }
    });

    if (!credentialsFound) {
      console.log('✅ No API credentials found in build files');
    }
  }

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} finally {
  // Restore original .env file
  if (fs.existsSync(envBackupPath)) {
    fs.copyFileSync(envBackupPath, envPath);
    fs.unlinkSync(envBackupPath);
    console.log('✅ Restored original .env file');
  }
}

console.log('🎉 Secure build process completed!');