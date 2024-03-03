import fs from "fs";
import path from "path";
import { SSGParams, SSGProps, StaticPathsReturn } from "@/types/next";
import { Link, Program } from "@/types/data";
import { getAllPrograms, getProgram } from "@/lib/programs";
import { markdownToJsx } from "@/lib/markdown";
import { default as NextLink } from "next/link";
import Head from "next/head";
import { PageTitle } from "@/lib/site";

type ProgramParams = {
  program: string;
};

export const getStaticPaths = (): StaticPathsReturn<ProgramParams> => {
  const paths = getAllPrograms().map((filename) => {
    return {
      params: {
        program: filename.replace(/\.md$/, ""),
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = ({
  params: { program },
}: SSGParams<ProgramParams>): SSGProps<{ content: string; link: string }> => {
  const links: Link = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "data", "links.json"), "utf-8")
  );
  const content = getProgram(program);
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
  const data = jsxMarkdown.data as Program;

  return (
    <div className="bg-card p-4 rounded shadow">
      <Head>
        <title>{PageTitle(data.title)}</title>
      </Head>
      <h1 className="text-xl font-bold text-foreground mb-2">{data.title}</h1>
      <div className="flex gap-2 items-center">
        <a
          href={link}
          className="text-xs text-primary-foregound bg-primary py-1 px-2 rounded"
        >
          Website
        </a>
        <time className="text-xs text-muted-foreground">
          {new Date(data.updated_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        {data.categories.map((category) => (
          <NextLink
            key={category}
            href={`/categories/${category}`}
            className="text-xs text-accent-foregound bg-accent py-1 px-2 rounded"
          >
            {category}
          </NextLink>
        ))}
      </div>
      <div className="prose mt-4 text-foreground">{jsxMarkdown.result}</div>
    </div>
  );
}
