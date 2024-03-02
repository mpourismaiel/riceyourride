import fs from "fs";
import path from "path";

import { Pick } from "@/types/data";

export const getRiceForPage = async (page: string, PAGE_SIZE: number) => {
  const allRices: Pick[] = JSON.parse(
    await fs.promises.readFile(
      path.join(process.cwd(), "data", "picks.json"),
      "utf-8"
    )
  );

  const start = (parseInt(page) - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const picks = allRices
    .sort(({ date: aDate }, { date: bDate }) => {
      const a = new Date(aDate);
      const b = new Date(bDate);
      return a > b ? -1 : a < b ? 1 : 0;
    })
    .slice(start, end)
    .map((pick) => {
      return {
        ...pick,
        wm: { url: pick.wm, title: pick.wm },
        programs: pick.programs.map((program) => {
          return { url: `/programs/${program}`, title: program };
        }),
      };
    });

  return picks;
};
