import { PiGithubLogoFill, PiRedditLogoFill } from "react-icons/pi";
import Image from "next/image";

import { PickAPI } from "@/types/data";
import Link from "next/link";

type RicePickProps = {
  pick: PickAPI;
};

const RicePick = ({ pick }: RicePickProps) => {
  return (
    <article className="bg-card p-4 rounded shadow">
      <div className="rice-details flex gap-4 items-center">
        <Link
          href={pick.wm.url}
          className="rice-wm text-xs text-primary-foreground hover:underline bg-primary rounded p-1"
        >
          {`[${pick.wm.title}]`}
        </Link>
        <div className="rice-creator flex gap-4">
          <a
            target="_blank"
            href={`https://www.reddit.com/user/${pick.reddit_username}`}
            className="text-xs text-secondary-foreground/50 hover:underline flex gap-2 items-center"
          >
            <PiRedditLogoFill />
            {pick.reddit_username}
          </a>
          <a
            target="_blank"
            href={`https://www.github.com/${pick.github_username}`}
            className="text-xs text-secondary-foreground/50 hover:underline flex gap-2 items-center"
          >
            <PiGithubLogoFill />
            {pick.github_username}
          </a>
        </div>
      </div>
      <div className="rice-screenshot my-4">
        {pick.screenshots.map((screenshot) => (
          <Image
            key={screenshot}
            src={screenshot}
            width={800}
            height={600}
            alt={pick.title}
          />
        ))}
      </div>
      <div className="rice-programs space-x-2 mb-2">
        {pick.programs.map((program) => (
          <Link
            href={program.url}
            key={`${pick.id}-${program.title}`}
            className="text-xs bg-secondary py-1 px-2 rounded text-primary-foreground"
          >
            {program.title}
          </Link>
        ))}
      </div>
      <a target="_blank" href={pick.post_url}>
        <h2 className="rice-title text-xl font-bold text-card-foreground hover:underline block">
          {pick.title}
        </h2>
      </a>
    </article>
  );
};

export default RicePick;
