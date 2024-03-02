import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";
import LinksJSON from "@/data/links.json";
import { Link } from "@/types/data";

const links = LinksJSON as Link;

export async function GET(
  req: NextRequest,
  { params: { program } }: { params: { program: string } }
) {
  if (
    !program ||
    !fs.existsSync(path.resolve("data/programs", `${program}.md`))
  ) {
    return Response.json({ error: "Program not found" }, { status: 404 });
  }

  const data = await fs.promises.readFile(
    path.resolve("data/programs", `${program}.md`),
    "utf-8"
  );
  return Response.json({ data, link: links[program] });
}
