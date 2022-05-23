import { readJSON, writeJSON } from "https://deno.land/x/flat/mod.ts";

export function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export async function exists(filename: string): Promise<boolean> {
  try {
    await Deno.stat(filename);
    // successful, file or directory must exist
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // file or directory does not exist
      return false;
    } else {
      // unexpected error, maybe permissions, pass it along
      throw error;
    }
  }
};

export async function appendJSON<T>(filepath: string, data: T[]) {
  const isExist = await exists(filepath);
  let combinedData: T[];
  if (isExist) {
    const currentData = await readJSON(filepath);
    combinedData = currentData.concat(data);
    const timestamp = new Date().toISOString();
    combinedData.map((obj) => ({ ...obj, timestamp }));
  } else {
    combinedData = data;
  }

  await writeJSON(filepath, combinedData);
}

export async function readOrExit<T>(filepath: string): Promise<T> {
  const isExist = await exists(filepath);
  if (!isExist) {
    Deno.exit(0);
  }

  return await readJSON(filepath);
}
