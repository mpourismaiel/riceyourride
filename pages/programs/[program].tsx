import fs from "fs";
import path from "path";
import Head from "next/head";
import { default as NextLink } from "next/link";

import { SSGParams, SSGProps, StaticPathsReturn } from "@/types/next";
import { Link, Program as ProgramType } from "@/types/data";
import { getAllPrograms, getProgram } from "@/lib/programs";
import { markdownToJsx } from "@/lib/markdown";
import { PageTitle } from "@/lib/site";
import PageHeader from "@/components/page-header";

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
}: SSGParams<ProgramParams>): SSGProps<{
  content: string;
  link: string;
  program: string;
}> => {
  const links: Link = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "data", "links.json"), "utf-8")
  );
  const content = getProgram(program);
  const link = links[program];
  return { props: { content, link, program } };
};

export default function Program(
  {
    content,
    link,
    program,
  }: {
    content: string;
    link: string;
    program: string;
  } = { content: "", link: "", program: "" }
) {
  const jsxMarkdown = markdownToJsx().processSync(content.replace(/\(\.link\)/g, `(${link})`));
  const data = jsxMarkdown.data as ProgramType;

  return (
    <>
      <PageHeader title={data.title} shouldGoBack>
        <NextLink
          href={`/rices/programs/${program}/1`}
          className="text-foreground"
        >
          {`Find rices using ${data.title}`}
        </NextLink>
      </PageHeader>
      <div className="bg-card p-4 rounded shadow">
        <Head>
          <title>{PageTitle(data.title)}</title>
        </Head>
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
        <div className="prose prose-invert prose-zinc max-w-none mt-4">
          {jsxMarkdown.result}
        </div>
      </div>
    </>
  );
}
