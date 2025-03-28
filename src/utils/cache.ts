import fs from "fs";
import path from "path";
import crypto from "crypto";
import { promises as fsPromises } from "fs";

// In Vercel's serverless environment, we need to use /tmp directory for temporary storage
// This directory is writable but doesn't persist between function invocations
const isVercel = process.env.VERCEL === "1";
const CACHE_DIR = isVercel
  ? path.join("/tmp", ".cache")
  : path.join(process.cwd(), ".cache");

// Try to create the cache directory, but don't fail if it can't be created
try {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
} catch (error) {
  console.warn("Could not create cache directory:", error);
  // Continue without caching
}

export async function generateImageHash(imageBuffer: Buffer): Promise<string> {
  const hash = crypto.createHash("sha256");
  hash.update(imageBuffer);
  return hash.digest("hex");
}

export async function getCachedAnalysis(
  imageHash: string
): Promise<string | null> {
  const cacheFile = path.join(CACHE_DIR, `${imageHash}.json`);

  try {
    // Check if cache file exists and is readable
    try {
      await fsPromises.access(cacheFile, fs.constants.R_OK);
    } catch {
      return null; // File doesn't exist or isn't readable
    }

    const fileContent = await fsPromises.readFile(cacheFile, "utf-8");
    const cacheData = JSON.parse(fileContent);

    // Check if cache has expired (7 days)
    if (Date.now() - cacheData.timestamp < 7 * 24 * 60 * 60 * 1000) {
      return cacheData.analysis;
    } else {
      // Remove expired cache
      try {
        await fsPromises.unlink(cacheFile);
      } catch {
        // Ignore deletion errors
      }
    }
  } catch (error) {
    console.error("Cache read error:", error);
  }

  return null;
}

export async function setCachedAnalysis(
  imageHash: string,
  analysis: string
): Promise<void> {
  // Don't attempt to cache if cache directory couldn't be created
  if (!fs.existsSync(CACHE_DIR)) {
    return;
  }

  const cacheFile = path.join(CACHE_DIR, `${imageHash}.json`);

  try {
    const cacheData = {
      analysis,
      timestamp: Date.now(),
    };

    await fsPromises.writeFile(cacheFile, JSON.stringify(cacheData), "utf-8");
  } catch (error) {
    console.error("Cache write error:", error);
    // Continue without caching
  }
}
