import RicePick from "@/components/rice-pick";
import { PickAPI, Program } from "@/types/data";
import { SSGParams, SSGProps, StaticPathsReturn } from "@/types/next";
import {
  getAllRices,
  getAllRicesByPrograms,
  getAllRicesByWm,
  getRiceForPage,
} from "@/lib/rices";
import { getAllProgramsByCategory, getProgram } from "@/lib/programs";
import Link from "next/link";
import { HiOutlineChevronLeft } from "react-icons/hi";
import { markdownToJsx } from "@/lib/markdown";

type RiceByProgramParams = {
  page: string;
  program: string;
};

const PAGE_SIZE = 10;

export const getStaticPaths = async (): Promise<
  StaticPathsReturn<RiceByProgramParams>
> => {
  const allPrograms = getAllProgramsByCategory(
    ["window-manager", "compositor", "desktop-environment"],
    true
  );
  const paths = allPrograms
    .map(({ filename }) => ({
      program: filename,
      totalPages: Math.ceil(
        getAllRicesByPrograms([filename]).length / PAGE_SIZE
      ),
    }))
    .map(({ program, totalPages }) =>
      Array.from({ length: totalPages }, (_, i) => ({
        params: { page: (i + 1).toString(), program },
      }))
    )
    .flat();

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = ({
  params: { program, page },
}: SSGParams<RiceByProgramParams>): SSGProps<{
  picks: PickAPI[];
  programTitle: string;
}> => {
  const programTitle = (
    markdownToJsx().processSync(getProgram(program)).data as Program
  ).title;
  const picks = getRiceForPage(
    getAllRicesByPrograms([program]),
    page,
    PAGE_SIZE
  );
  return { props: { picks, programTitle } };
};

export default function Best({
  picks,
  programTitle,
}: {
  picks: PickAPI[];
  programTitle: string;
}) {
  return (
    <main>
      <div className="flex gap-2 items-center mb-4 mt-8">
        <Link href="/best/1" className="text-foreground text-3xl">
          <HiOutlineChevronLeft />
        </Link>
        <h1 className="text-2xl font-bold text-foreground">{`Picks using ${programTitle}`}</h1>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-8">
        {picks.map((pick) => (
          <RicePick key={pick.id} pick={pick} />
        ))}
      </div>
    </main>
  );
}
