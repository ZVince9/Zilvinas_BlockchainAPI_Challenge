import fs from "fs";
import path from "path";

export async function getCachedData(
  fileName: string,
  fetcher: () => Promise<any>
) {
  const cacheDir = path.join(process.cwd(), ".cache");
  const cachePath = path.join(cacheDir, `${fileName}.json`);

  if (fs.existsSync(cachePath)) {
    return JSON.parse(fs.readFileSync(cachePath, "utf8"));
  }

  const data = await fetcher();

  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(cachePath, JSON.stringify(data, null, 2));

  return data;
}
