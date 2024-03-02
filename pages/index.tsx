import RicePick from "@/components/rice-pick";
import { getRiceForPage } from "@/lib/rices";
import { PickAPI } from "@/types/data";

export const getStaticProps = async () => {
  const picks = await getRiceForPage("1", 4);
  return { props: { picks } };
};

const Home = ({ picks }: { picks: PickAPI[] }) => {
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
};

export default Home;
