import { ITrend } from "./interfaces.ts";
import { appendJSON } from "./utility.ts";
import { readJSON} from "https://deno.land/x/flat/mod.ts";

const filename = Deno.args[0]; // Same name as downloaded_filename
const trends: ITrend[] = await readJSON(filename);

// get trending in last 24 hours
const today = new Date();
const yesterdayMorning = new Date(today.setDate(today.getDate() - 1));
const yesterdayMidnight = new Date(today.setDate(today.getDate() - 1));

yesterdayMorning.setHours(0, 0, 0); // after midnight
yesterdayMidnight.setHours(23, 59, 59); // before midnight

const trendingInLast24Hour = trends.filter(({ timestamp }) => {
  const current = new Date(timestamp);
  return (current <= yesterdayMorning && current <= yesterdayMidnight);
});

const key = "keyword";

// get unique trend in last 24 hours
const currentTrends = [
  ...new Map(trendingInLast24Hour.map((item) => [item[key], item])).values(),
];

await appendJSON<ITrend>("keywords.json", currentTrends);
