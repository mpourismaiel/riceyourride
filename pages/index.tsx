import { HiOutlineChevronRight } from "react-icons/hi";
import RicePick from "@/components/rice-pick";
import { getAllRices, getRiceForPage } from "@/lib/rices";
import { PickAPI, Program } from "@/types/data";
import Link from "next/link";
import { SSGProps } from "@/types/next";
import { getAllProgramsData } from "@/lib/programs";

export const getStaticProps = (): SSGProps<{
  picks: PickAPI[];
  programs: (Program & { filename: string })[];
}> => {
  const picks = getRiceForPage(getAllRices(), "1", 4);
  const programsData = getAllProgramsData();
  const programs = Object.keys(programsData).map((filename) => ({
    filename: filename.replace(/\.md$/, ""),
    ...programsData[filename],
  }));
  return { props: { picks, programs } };
};

const Home = ({
  picks,
  programs,
}: {
  picks: PickAPI[];
  programs: (Program & { filename: string })[];
}) => {
  return (
    <main>
      <div className="flex gap-2 items-center mb-4 mt-8">
        <h1 className="text-2xl font-bold text-foreground">Latest Picks</h1>
        <Link href="/best/1" className="text-foreground text-3xl">
          <HiOutlineChevronRight />
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {picks.map((pick) => (
          <RicePick key={pick.id} pick={pick} />
        ))}
      </div>
      <div className="flex gap-2 items-center mt-8 mb-4">
        <h1 className="text-2xl font-bold text-foreground">All Programs</h1>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        {programs.map((program) => (
          <Link
            href={`/programs/${program.filename}`}
            key={program.filename}
            className="text-primary-foreground text-sm bg-primary px-2 py-1 rounded shadow"
          >
            {program.title}
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Home;
