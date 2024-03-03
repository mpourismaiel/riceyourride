import RicePick from "@/components/rice-pick";
import { PickAPI, Program } from "@/types/data";
import { SSGParams, SSGProps, StaticPathsReturn } from "@/types/next";
import { getAllRices, getAllRicesByWm, getRiceForPage } from "@/lib/rices";
import { getAllProgramsByCategory, getProgram } from "@/lib/programs";
import Link from "next/link";
import { HiOutlineChevronLeft } from "react-icons/hi";
import { markdownToJsx } from "@/lib/markdown";

type RiceByWmParams = {
  page: string;
  wm: string;
};

const PAGE_SIZE = 10;

export const getStaticPaths = async (): Promise<
  StaticPathsReturn<RiceByWmParams>
> => {
  const allWMs = getAllProgramsByCategory([
    "window-manager",
    "compositor",
    "desktop-environment",
  ]);
  const paths = allWMs
    .map(({ filename }) => ({
      wm: filename,
      totalPages: Math.ceil(getAllRicesByWm(filename).length / PAGE_SIZE),
    }))
    .map(({ wm, totalPages }) =>
      Array.from({ length: totalPages }, (_, i) => ({
        params: { page: (i + 1).toString(), wm },
      }))
    )
    .flat();

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = ({
  params: { wm, page },
}: SSGParams<RiceByWmParams>): SSGProps<{
  picks: PickAPI[];
  wmTitle: string;
}> => {
  const wmTitle = (markdownToJsx().processSync(getProgram(wm)).data as Program)
    .title;
  const picks = getRiceForPage(getAllRicesByWm(wm), page, PAGE_SIZE);
  return { props: { picks, wmTitle } };
};

export default function Best({
  picks,
  wmTitle,
}: {
  picks: PickAPI[];
  wmTitle: string;
}) {
  return (
    <main>
      <div className="flex gap-2 items-center mb-4 mt-8">
        <Link href="/best/1" className="text-foreground text-3xl">
          <HiOutlineChevronLeft />
        </Link>
        <h1 className="text-2xl font-bold text-foreground">{`Picks using ${wmTitle}`}</h1>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-8">
        {picks.map((pick) => (
          <RicePick key={pick.id} pick={pick} />
        ))}
      </div>
    </main>
  );
}
