import { readJSON, writeJSON } from "https://deno.land/x/flat/mod.ts";

export function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export async function appendJSON<T>(filepath: string, data: T[]) {
  const currentData = await readJSON(filepath);
  const combinedData: T[] = currentData.concat(data);
  const timestamp = new Date().toISOString();
  combinedData.map((obj) => ({ ...obj, timestamp }));
  await writeJSON(filepath, combinedData);
}
