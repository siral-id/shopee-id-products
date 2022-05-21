import { readJSON, writeJSON } from "https://deno.land/x/flat/mod.ts";
import {existsSync} from "https://deno.land/std/fs/mod.ts";


export function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export async function appendJSON<T>(filepath: string, data: T[]) {
  const isExist = existsSync(filepath)
  let combinedData: T[];
  if(isExist){
    const currentData = await readJSON(filepath);
    combinedData = currentData.concat(data);
    const timestamp = new Date().toISOString();
    combinedData.map((obj) => ({ ...obj, timestamp }));
  }else{
    combinedData = data;
  }

  await writeJSON(filepath, combinedData);
}
