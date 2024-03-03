import fs from "fs";
import path from "path";
import { markdownToJsx } from "./markdown";
import { Program } from "@/types/data";

let allPrograms: Record<string, Program> = {};

export const getAllPrograms = (): string[] =>
  fs.readdirSync(path.join(process.cwd(), "data", "programs"));

export const getAllProgramsData = () => {
  if (allPrograms.length) {
    return allPrograms;
  }

  allPrograms = getAllPrograms().reduce<Record<string, Program>>(
    (acc, filename) => {
      acc[filename] = markdownToJsx().processSync(
        getProgram(filename.replace(/\.md$/, ""))
      ).data as Program;
      return acc;
    },
    {}
  );

  return allPrograms;
};

export const getProgram = (filename: string): string =>
  fs.readFileSync(
    path.join(process.cwd(), "data", "programs", `${filename}.md`),
    "utf-8"
  );
