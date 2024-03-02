import { NextRequest } from "next/server";
import LinksJSON from "@/data/links.json";
import DataJSON from "@/data/picks.json";
import { Link, Pick } from "@/types/data";

const links = LinksJSON as Link;
const data = DataJSON as Pick[];

export async function GET(request: NextRequest) {
  const page = parseInt(request.nextUrl.searchParams.get("page") || "0");
  const pageSize = parseInt(
    request.nextUrl.searchParams.get("pageSize") || "10"
  );
  const q = request.nextUrl.searchParams.get("q") || "";
  const wm = request.nextUrl.searchParams.get("wm") || "";
  const programs = request.nextUrl.searchParams.get("programs") || "";
  const username = request.nextUrl.searchParams.get("username") || "";
  const filteredData: Pick[] =
    q || wm || programs.length || username
      ? data.filter((pick) => {
          if (q && pick.title.toLowerCase().includes(q.toLowerCase()))
            return true;
          if (wm && pick.wm.toLowerCase().includes(wm.toLowerCase()))
            return true;
          if (
            programs &&
            programs
              .split(",")
              .some((program) => pick.programs.includes(program.trim()))
          )
            return true;
          if (
            username &&
            (pick.reddit_username
              .toLowerCase()
              .includes(username.toLowerCase()) ||
              pick.github_username
                .toLowerCase()
                .includes(username.toLowerCase()))
          )
            return true;
          return false;
        })
      : data;

  const picks = filteredData
    .sort(({ date: aDate }, { date: bDate }) => {
      const a = new Date(aDate);
      const b = new Date(bDate);
      return a > b ? -1 : a < b ? 1 : 0;
    })
    .slice(page * pageSize, (page + 1) * pageSize)
    .map((pick) => {
      return {
        ...pick,
        wm: { url: links[pick.wm] || pick.wm, title: pick.wm },
        programs: pick.programs.map((program) => {
          return { url: `/programs/${program}`, title: program };
        }),
      };
    });

  return Response.json(picks);
}
