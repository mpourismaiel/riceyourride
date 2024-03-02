import RicePick from "@/components/rice-pick";
import { PickAPI } from "@/types/data";
import Image from "next/image";

async function getData(): Promise<PickAPI[]> {
  const res = await fetch("http://localhost:3000/api/picks?pageSize=10&page=0");
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Home() {
  const data = await getData();

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4 mt-8">Latest Picks</h1>
      <div className="grid grid-cols-4 gap-4">
        {data.map((pick) => (
          <RicePick key={pick.id} pick={pick} />
        ))}
      </div>
    </main>
  );
}
