import fs from "fs";
import path from "path";
import crypto from "crypto";

// Create cache directory if it doesn't exist
const CACHE_DIR = path.join(process.cwd(), ".cache");
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
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
    if (fs.existsSync(cacheFile)) {
      const cacheData = JSON.parse(fs.readFileSync(cacheFile, "utf-8"));

      // Check if cache has expired (7 days)
      if (Date.now() - cacheData.timestamp < 7 * 24 * 60 * 60 * 1000) {
        return cacheData.analysis;
      } else {
        // Remove expired cache
        fs.unlinkSync(cacheFile);
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
  const cacheFile = path.join(CACHE_DIR, `${imageHash}.json`);

  try {
    const cacheData = {
      analysis,
      timestamp: Date.now(),
    };

    fs.writeFileSync(cacheFile, JSON.stringify(cacheData), "utf-8");
  } catch (error) {
    console.error("Cache write error:", error);
  }
}
