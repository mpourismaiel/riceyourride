import fs from "fs";
import path from "path";
import RicePick from "@/components/rice-pick";
import { Pick, PickAPI } from "@/types/data";
import { SSGParams, SSGProps, StaticPathsReturn } from "@/types/next";
import { getRiceForPage } from "@/lib/rices";

type RicePickParams = {
  page: string;
};

const PAGE_SIZE = 10;

export const getStaticPaths = async (): Promise<
  StaticPathsReturn<RicePickParams>
> => {
  const allRices: Pick[] = JSON.parse(
    await fs.promises.readFile(
      path.join(process.cwd(), "data", "picks.json"),
      "utf-8"
    )
  );

  const totalPages = Math.ceil(allRices.length / PAGE_SIZE);
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    params: { page: (i + 1).toString() },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({
  params: { page },
}: SSGParams<RicePickParams>): Promise<SSGProps<{ picks: PickAPI[] }>> => {
  const picks = await getRiceForPage(page, PAGE_SIZE);
  return { props: { picks } };
};

export default function Best({ picks }: { picks: PickAPI[] }) {
  return (
    <main>
      <h1 className="text-2xl font-bold mb-4 mt-8 text-foreground">
        Latest Picks
      </h1>
      <div className="grid grid-cols-4 gap-4">
        {picks.map((pick) => (
          <RicePick key={pick.id} pick={pick} />
        ))}
      </div>
    </main>
  );
}
