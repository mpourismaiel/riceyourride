import fs from "fs";
import path from "path";

export const getAllPrograms = (): Promise<string[]> =>
  fs.promises.readdir(path.join(process.cwd(), "data", "programs"));

export const getProgram = (filename: string): Promise<string> =>
  fs.promises.readFile(
    path.join(process.cwd(), "data", "programs", `${filename}.md`),
    "utf-8"
  );
