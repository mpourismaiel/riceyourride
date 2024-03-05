import fs from "fs";
import path from "path";
import { markdownToJsx } from "./markdown";
import { Program, ProgramWithFilename } from "@/types/data";

export const getAllPrograms = (): string[] =>
  fs.readdirSync(path.join(process.cwd(), "data", "programs"));

export const getAllProgramsDataObj = (): Record<string, Program> => {
  const allPrograms: Record<string, Program> = getAllPrograms().reduce<
    Record<string, Program>
  >((acc, filename) => {
    acc[filename] = markdownToJsx().processSync(
      getProgram(filename.replace(/\.md$/, ""))
    ).data as Program;
    return acc;
  }, {});

  return allPrograms;
};

export const getAllProgramsDataWithFilename = (): ProgramWithFilename[] =>
  getAllPrograms().map((filename) => {
    const program = filename.replace(/\.md$/, "");
    const content = getProgram(program);
    const data = markdownToJsx().processSync(content).data as Program;
    return { ...data, filename: program };
  });

export const getAllProgramCategories = (): string[] => {
  const programs = getAllProgramsDataObj();
  return Object.keys(programs)
    .map((filename) => programs[filename].categories)
    .flat()
    .filter((category, index, self) => self.indexOf(category) === index);
};

export const getAllProgramsByCategory = (
  categories: string[] = [],
  excludeMode: boolean = false,
  exclusive: boolean = false
): ProgramWithFilename[] => {
  const programs = getAllProgramsDataObj();
  const withFileName = Object.keys(programs).map((filename) => ({
    filename: filename.replace(/\.md$/, ""),
    ...programs[filename],
  }));

  if (!categories.length) {
    return withFileName;
  }

  if (excludeMode) {
    return withFileName.filter((program) =>
      categories.every((category) => !program.categories.includes(category))
    );
  }

  return withFileName.filter((program) =>
    exclusive
      ? categories.every((category) => program.categories.includes(category))
      : categories.some((category) => program.categories.includes(category))
  );
};

export const getProgram = (filename: string): string =>
  fs.readFileSync(
    path.join(process.cwd(), "data", "programs", `${filename}.md`),
    "utf-8"
  );
