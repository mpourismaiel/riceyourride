import { PickAPI } from "@/types/data";
import RicePick from "./rice-pick";

const RiceShowcase = ({
  rices,
  limit,
}: {
  rices: PickAPI[];
  limit?: number;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {rices.map((rice, i) => (
        <RicePick
          key={`${rice.id}-${i}`}
          pick={rice}
          isLimited={!!limit && i >= limit}
        />
      ))}
    </div>
  );
};

export default RiceShowcase;
