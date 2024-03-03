import fs from "fs";
import path from "path";

import { Pick } from "@/types/data";
import { markdownToJsx } from "./markdown";

let allRices: Pick[] = [];

export const getAllRices = (): Pick[] => {
  if (allRices.length) {
    return allRices;
  }

  allRices = fs
    .readdirSync(path.join(process.cwd(), "data", "rices"))
    .map((filename) => {
      const content = fs.readFileSync(
        path.join(process.cwd(), "data", "rices", filename),
        "utf-8"
      );

      const markdown = markdownToJsx().processSync(content);
      return markdown.data as Pick;
    })
    .sort(({ id: aId }, { id: bId }) => {
      const a = aId;
      const b = bId;
      return a > b ? -1 : a < b ? 1 : 0;
    });

  return allRices;
};

export const getRiceForPage = (page: string, PAGE_SIZE: number) => {
  const start = (parseInt(page) - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const picks = getAllRices()
    .sort(({ date: aDate }, { date: bDate }) => {
      const a = new Date(aDate);
      const b = new Date(bDate);
      return a > b ? -1 : a < b ? 1 : 0;
    })
    .slice(start, end)
    .map((pick) => {
      return {
        ...pick,
        wm: { url: `/programs/${pick.wm}`, title: pick.wm },
        programs: pick.programs.map((program) => {
          return { url: `/programs/${program}`, title: program };
        }),
      };
    });

  return picks;
};
