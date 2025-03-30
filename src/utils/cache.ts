import fs from "fs";
import path from "path";
import crypto from "crypto";

// Create an in-memory cache fallback
const memoryCache = new Map<string, { analysis: string; timestamp: number }>();

// Create cache directory if it doesn't exist
// Use Node.js temp directory to avoid filesystem permission issues
const CACHE_DIR = path.join(process.cwd(), ".cache");
let useFileSystemCache = false; // Default to memory cache only

try {
  // Attempt to create and test the cache directory
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  // Test write access by creating and removing a test file
  const testFile = path.join(CACHE_DIR, ".test");
  fs.writeFileSync(testFile, "test");
  fs.unlinkSync(testFile);

  useFileSystemCache = true;
  console.log("Cache directory is working at:", CACHE_DIR);
} catch (error) {
  console.error("Unable to use filesystem cache:", error);
  console.log("Using in-memory cache only (no filesystem)");
}

export async function generateImageHash(imageBuffer: Buffer): Promise<string> {
  const hash = crypto.createHash("sha256");
  hash.update(imageBuffer);
  return hash.digest("hex");
}

export async function getCachedAnalysis(
  imageHash: string
): Promise<string | null> {
  // Always check memory cache first
  if (memoryCache.has(imageHash)) {
    const cacheData = memoryCache.get(imageHash)!;

    // Check if cache has expired (7 days)
    if (Date.now() - cacheData.timestamp < 7 * 24 * 60 * 60 * 1000) {
      return cacheData.analysis;
    } else {
      // Remove expired memory cache
      memoryCache.delete(imageHash);
    }
  }

  // Only try file system if enabled
  if (useFileSystemCache) {
    const cacheFile = path.join(CACHE_DIR, `${imageHash}.json`);

    try {
      if (fs.existsSync(cacheFile)) {
        const fileContent = fs.readFileSync(cacheFile, "utf-8");
        if (!fileContent) {
          return null;
        }

        try {
          const cacheData = JSON.parse(fileContent);

          // Check if cache has expired (7 days)
          if (Date.now() - cacheData.timestamp < 7 * 24 * 60 * 60 * 1000) {
            return cacheData.analysis;
          } else {
            // Remove expired cache
            try {
              fs.unlinkSync(cacheFile);
            } catch (unlinkError) {
              // Ignore deletion errors
            }
          }
        } catch (parseError) {
          console.error("Cache parse error:", parseError);
          // Remove corrupted cache
          try {
            fs.unlinkSync(cacheFile);
          } catch (unlinkError) {
            // Ignore deletion errors
          }
        }
      }
    } catch (error) {
      console.error("Cache read error:", error);
      // Disable file system cache if persistent errors
      if (error.code === "EACCES" || error.code === "EPERM") {
        useFileSystemCache = false;
        console.log("Disabled filesystem cache due to permission errors");
      }
    }
  }

  return null;
}

export async function setCachedAnalysis(
  imageHash: string,
  analysis: string
): Promise<void> {
  // Always store in memory cache
  memoryCache.set(imageHash, {
    analysis,
    timestamp: Date.now(),
  });

  // Only try file system if enabled
  if (useFileSystemCache) {
    const cacheFile = path.join(CACHE_DIR, `${imageHash}.json`);

    try {
      // Make sure the cache directory exists before writing to it
      if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
      }

      const cacheData = {
        analysis,
        timestamp: Date.now(),
      };

      // Write atomically by first writing to a temp file then renaming
      const tempFile = `${cacheFile}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(cacheData), "utf-8");

      // Rename is atomic on most filesystems
      try {
        if (fs.existsSync(cacheFile)) {
          fs.unlinkSync(cacheFile);
        }
        fs.renameSync(tempFile, cacheFile);
      } catch (renameError) {
        console.error("Cache rename error:", renameError);
        // Try direct write as fallback
        fs.writeFileSync(cacheFile, JSON.stringify(cacheData), "utf-8");
      }
    } catch (error) {
      console.error("Cache write error:", error);
      // Disable file system cache if persistent errors
      if (error.code === "EACCES" || error.code === "EPERM") {
        useFileSystemCache = false;
        console.log("Disabled filesystem cache due to permission errors");
      }
    }
  }
}
