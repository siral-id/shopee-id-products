import { readJSON, writeJSON } from "https://deno.land/x/flat/mod.ts";

export function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export async function appendJSON<T>(filepath: string, data: T[]) {
  const currentData = await readJSON(filepath);
  const combinedData = currentData.concat(data);
  await writeJSON(filepath, combinedData);
}
