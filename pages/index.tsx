import Link from "next/link";
import Head from "next/head";

import RicePick from "@/components/rice-pick";
import { getAllRices, getRiceForPage } from "@/lib/rices";
import { PickAPI, ProgramWithFilename } from "@/types/data";
import { SSGProps } from "@/types/next";
import { getAllProgramsDataWithFilename } from "@/lib/programs";
import { PageTitle } from "@/lib/site";
import Search from "@/components/search";
import PageHeader from "@/components/page-header";
import RiceShowcase from "@/components/rice-showcase";

export const getStaticProps = (): SSGProps<{
  picks: PickAPI[];
  programs: ProgramWithFilename[];
}> => {
  const picks = getRiceForPage(getAllRices(), "1", 12);
  const programs = getAllProgramsDataWithFilename();
  return { props: { picks, programs } };
};

const Home = ({
  picks,
  programs,
}: {
  picks: PickAPI[];
  programs: ProgramWithFilename[];
}) => {
  return (
    <main>
      <Head>
        <title>{PageTitle("Home")}</title>
      </Head>
      <div className="flex gap-2 items-center mt-8 mb-4">
        <h1 className="text-2xl font-bold text-foreground">Programs</h1>
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
      <PageHeader title="Latest Rices" link="/best/1">
        <Search programs={programs} />
      </PageHeader>
      <RiceShowcase rices={picks} limit={12} />
    </main>
  );
};

export default Home;
