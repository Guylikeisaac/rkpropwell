const fs = require('fs').promises;
const path = require('path');

// Clean up uploaded files
const cleanupFiles = async (files) => {
  if (!files || files.length === 0) return;
  
  try {
    await Promise.all(
      files.map(async (file) => {
        try {
          await fs.unlink(file.path);
        } catch (error) {
          console.error(`Failed to delete file ${file.path}:`, error);
        }
      })
    );
  } catch (error) {
    console.error('Error during file cleanup:', error);
  }
};

// Delete single file
const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error(`Failed to delete file ${filePath}:`, error);
    return false;
  }
};

// Check if file exists
const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

// Create directory if it doesn't exist
const ensureDir = async (dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    return true;
  } catch (error) {
    console.error(`Failed to create directory ${dirPath}:`, error);
    return false;
  }
};

module.exports = {
  cleanupFiles,
  deleteFile,
  fileExists,
  ensureDir
};
