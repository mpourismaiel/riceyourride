import fs from "fs";
import path from "path";
import RemarkLinkRewrite from "remark-link-rewrite";
import { SSGParams, SSGProps, StaticPathsReturn } from "@/types/next";
import { Link } from "@/types/data";
import { getAllPrograms, getProgram } from "@/lib/programs";
import { markdownToJsx } from "@/lib/markdown";

type ProgramParams = {
  program: string;
};

export const getStaticPaths = async (): Promise<
  StaticPathsReturn<ProgramParams>
> => {
  const paths = await Promise.all(
    (
      await getAllPrograms()
    ).map(async (filename) => {
      return {
        params: {
          program: filename.replace(/\.md$/, ""),
        },
      };
    })
  );

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({
  params: { program },
}: SSGParams<ProgramParams>): Promise<
  SSGProps<{ content: string; link: string }>
> => {
  const links: Link = JSON.parse(
    await fs.promises.readFile(
      path.join(process.cwd(), "data", "links.json"),
      "utf-8"
    )
  );
  const content = await getProgram(program);
  const link = links[program];
  return { props: { content, link } };
};

export default function Program(
  {
    content,
    link,
  }: {
    content: string;
    link: string;
  } = { content: "", link: "" }
) {
  const jsxMarkdown = markdownToJsx().processSync(content);

  return (
    <div className="bg-card p-4 rounded shadow">
      <h1 className="text-xl font-bold text-foreground mb-2">
        {jsxMarkdown.data.title as string}
      </h1>
      <div className="flex gap-2 items-center">
        <a
          href={link}
          className="text-xs text-primary-foregound bg-primary py-1 px-2 rounded"
        >
          Website
        </a>
        <time className="text-xs text-muted-foreground">
          {new Date(jsxMarkdown.data.updated_at as string).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          )}
        </time>
      </div>
      <div className="prose mt-4 text-foreground">{jsxMarkdown.result}</div>
    </div>
  );
}
