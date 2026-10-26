#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if we're being installed as a dependency
// Method 1: Check if running in node_modules
// Method 2: Check if INIT_CWD (npm's original directory) differs from our location
const isInNodeModules = __dirname.includes('node_modules');
const isCalledByNpmInstall = process.env.INIT_CWD && !__dirname.startsWith(process.env.INIT_CWD);
const isInstalledAsDependency = isInNodeModules || isCalledByNpmInstall;

if (!isInstalledAsDependency) {
  // Running in the source repo itself, not as an installed dependency
  process.exit(0);
}

// Paths
const sourceDir = path.join(__dirname, '..', '.claude', 'skills');
// Copy to global Claude skills directory instead of project-local
const homeDir = process.env.HOME || process.env.USERPROFILE; // Works on Unix/Windows
const targetDir = path.join(homeDir, '.claude', 'skills');

// Check if source directory exists
if (!fs.existsSync(sourceDir)) {
  console.error('⚠️  No Claude skills found to copy');
  process.exit(0);
}

try {
  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.error('✅ Created global .claude/skills directory');
  }

  // Copy skill files
  const skillDirs = fs.readdirSync(sourceDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  let copiedCount = 0;

  skillDirs.forEach(skillDir => {
    const sourceSkillDir = path.join(sourceDir, skillDir);
    const targetSkillDir = path.join(targetDir, skillDir);

    // Create target skill directory
    if (!fs.existsSync(targetSkillDir)) {
      fs.mkdirSync(targetSkillDir, { recursive: true });
    }

    // Copy all files in the skill directory
    const files = fs.readdirSync(sourceSkillDir);
    files.forEach(file => {
      const sourceFile = path.join(sourceSkillDir, file);
      const targetFile = path.join(targetSkillDir, file);

      // Only copy if target doesn't exist (don't overwrite user modifications)
      if (!fs.existsSync(targetFile)) {
        fs.copyFileSync(sourceFile, targetFile);
        copiedCount++;
      }
    });
  });

  if (copiedCount > 0) {
    // Use console.error to ensure visibility (npm doesn't suppress stderr)
    console.error('');
    console.error('┌─────────────────────────────────────────────────────────────────┐');
    console.error('│ ✅ Zendesk GlobalNav Template - Claude Skills Installed        │');
    console.error('├─────────────────────────────────────────────────────────────────┤');
    console.error(`│ Copied ${copiedCount} skill file(s) to: ~/.claude/skills/              │`);
    console.error('│                                                                 │');
    console.error('│ Skills available:                                               │');
    console.error('│   • /globalnav-start - Set up new GlobalNav projects           │');
    console.error('│   • /build-main-content - Build main content features          │');
    console.error('│                                                                 │');
    console.error('│ 🌍 These skills are now available in ALL your projects         │');
    console.error('│                                                                 │');
    console.error('│ ⚠️  IMPORTANT: RESTART Claude Code to load these skills        │');
    console.error('└─────────────────────────────────────────────────────────────────┘');
    console.error('');
  } else {
    console.error('');
    console.error('┌─────────────────────────────────────────────────────────────────┐');
    console.error('│ ℹ️  Zendesk GlobalNav Template - Skills Already Installed      │');
    console.error('├─────────────────────────────────────────────────────────────────┤');
    console.error('│ Claude skills already exist in: ~/.claude/skills/              │');
    console.error('│                                                                 │');
    console.error('│ Skills available:                                               │');
    console.error('│   • /globalnav-start - Set up new GlobalNav projects           │');
    console.error('│   • /build-main-content - Build main content features          │');
    console.error('│                                                                 │');
    console.error('│ If you cannot use these skills, RESTART Claude Code            │');
    console.error('└─────────────────────────────────────────────────────────────────┘');
    console.error('');
  }

} catch (error) {
  console.error('⚠️  Error copying Claude skills:', error.message);
  // Don't fail the installation
  process.exit(0);
}
