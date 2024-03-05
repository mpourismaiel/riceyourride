import Head from "next/head";

import RicePick from "@/components/rice-pick";
import { getAllRicesByPrograms, getRiceForPage } from "@/lib/rices";
import { getAllPrograms, getProgram } from "@/lib/programs";
import { markdownToJsx } from "@/lib/markdown";
import { PageTitle } from "@/lib/site";
import { PickAPI, Program } from "@/types/data";
import { SSGParams, SSGProps, StaticPathsReturn } from "@/types/next";
import PageHeader from "@/components/page-header";
import RiceShowcase from "@/components/rice-showcase";

type RiceByProgramParams = {
  page: string;
  program: string;
};

type RicesByProgramInPage = {
  page: string;
  picks: PickAPI[];
  programTitle: string;
};

const PAGE_SIZE = 10;

export const getStaticPaths = async (): Promise<
  StaticPathsReturn<RiceByProgramParams>
> => {
  const paths = getAllPrograms()
    .map((filename) => ({
      program: filename.replace(/\.md$/, ""),
      totalPages: Math.ceil(
        getAllRicesByPrograms([filename.replace(/\.md$/, "")]).length /
          PAGE_SIZE
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
}: SSGParams<RiceByProgramParams>): SSGProps<RicesByProgramInPage> => {
  const programTitle = (
    markdownToJsx().processSync(getProgram(program)).data as Program
  ).title;
  const picks = getRiceForPage(
    getAllRicesByPrograms([program]),
    page,
    PAGE_SIZE
  );
  return { props: { page, picks, programTitle } };
};

export default function RicesByProgramInPage({
  page,
  picks,
  programTitle,
}: RicesByProgramInPage) {
  return (
    <main>
      <Head>
        <title>{PageTitle(`Rices using ${programTitle} - Page ${page}`)}</title>
      </Head>
      <PageHeader title={`Picks using ${programTitle}`} shouldGoBack />
      <RiceShowcase rices={picks} />
    </main>
  );
}
