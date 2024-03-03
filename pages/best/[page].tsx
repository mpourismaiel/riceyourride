import fs from "fs";
import path from "path";
import RicePick from "@/components/rice-pick";
import { Pick, PickAPI } from "@/types/data";
import { SSGParams, SSGProps, StaticPathsReturn } from "@/types/next";
import { getAllRices, getRiceForPage } from "@/lib/rices";

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
}: SSGParams<RicePickParams>): SSGProps<{ picks: PickAPI[] }> => {
  const picks = getRiceForPage(page, PAGE_SIZE);
  return { props: { picks } };
};

export default function Best({ picks }: { picks: PickAPI[] }) {
  return (
    <main>
      <div className="grid grid-cols-4 gap-4 mt-8">
        {picks.map((pick) => (
          <RicePick key={pick.id} pick={pick} />
        ))}
      </div>
    </main>
  );
}
