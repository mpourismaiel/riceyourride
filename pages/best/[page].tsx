import Head from "next/head";

import RicePick from "@/components/rice-pick";
import { getAllRices, getRiceForPage } from "@/lib/rices";
import { PickAPI, Program, ProgramWithFilename } from "@/types/data";
import { SSGParams, SSGProps, StaticPathsReturn } from "@/types/next";
import { getAllProgramsDataWithFilename } from "@/lib/programs";
import { PageTitle } from "@/lib/site";
import Search from "@/components/search";
import PageHeader from "@/components/page-header";
import RiceShowcase from "@/components/rice-showcase";

type RicePickParams = {
  page: string;
};

const PAGE_SIZE = 10;

export const getStaticPaths = async (): Promise<
  StaticPathsReturn<RicePickParams>
> => {
  const totalPages = Math.ceil(getAllRices().length / PAGE_SIZE);
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    params: { page: (i + 1).toString() },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = ({
  params: { page },
}: SSGParams<RicePickParams>): SSGProps<{
  page: string;
  picks: PickAPI[];
  programs: ProgramWithFilename[];
}> => {
  const picks = getRiceForPage(getAllRices(), page, PAGE_SIZE);
  const programs = getAllProgramsDataWithFilename();
  return { props: { page, picks, programs } };
};

export default function Best({
  page,
  picks,
  programs,
}: {
  page: string;
  picks: PickAPI[];
  programs: ProgramWithFilename[];
}) {
  return (
    <main>
      <Head>
        <title>{PageTitle(`Best Rices - Page ${page}`)}</title>
      </Head>
      <PageHeader title="Latest Rices">
        <Search programs={programs} />
      </PageHeader>
      <RiceShowcase rices={picks} />
    </main>
  );
}
