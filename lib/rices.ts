import fs from "fs";
import path from "path";

import { Pick, PickAPI } from "@/types/data";
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

const sortRices = ({ date: aDate }: Pick, { date: bDate }: Pick) => {
  const a = new Date(aDate);
  const b = new Date(bDate);
  return a > b ? -1 : a < b ? 1 : 0;
};

const formatRice = (rice: Pick): PickAPI => ({
  ...rice,
  wm: { url: `/programs/${rice.wm}`, title: rice.wm },
  programs: rice.programs.map((program) => {
    return { url: `/programs/${program}`, title: program };
  }),
});

export const getAllRicesByPrograms = (programs: string[]): Pick[] => {
  return getAllRices()
    .sort(sortRices)
    .filter((pick) =>
      programs.every(
        (program) => pick.wm === program || pick.programs.includes(program)
      )
    );
};

export const getRiceForPage = (
  rices: Pick[],
  page: string,
  PAGE_SIZE: number
) => {
  const start = (parseInt(page) - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const picks = rices.sort(sortRices).slice(start, end).map(formatRice);

  return picks;
};
