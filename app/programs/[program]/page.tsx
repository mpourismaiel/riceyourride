import rehypeReact from "rehype-react";
import remarkFrontmatter from "remark-frontmatter";
import extract from "remark-extract-frontmatter";
import yaml from "yaml";
import * as prod from "react/jsx-runtime";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import RemarkLinkRewrite from "remark-link-rewrite";
import { unified } from "unified";
const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs };

async function getData({
  program,
}: {
  program: string;
}): Promise<{ data: string; link: string }> {
  const res = await fetch(`http://localhost:3000/api/programs/${program}`);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Page({
  params: { program },
}: {
  params: { program: string };
}) {
  const data = await getData({ program });
  const content = await unified()
    .use(remarkParse)
    .use(RemarkLinkRewrite, {
      replacer: (url: string) => {
        if (url === ".link") {
          return url.replace(".link", data.link);
        }
        return url;
      },
    })
    .use(remarkFrontmatter, "yaml")
    .use(extract, { yaml: yaml.parse })
    .use(remarkRehype)
    .use(rehypeReact, production as any)
    .process(data.data);

  return (
    <div className="bg-card p-4 rounded shadow">
      <h1 className="text-xl font-bold mb-2">{content.data.title as string}</h1>
      <div className="flex gap-2 items-center">
        <a
          href={data.link}
          className="text-xs text-primary-foregound bg-primary py-1 px-2 rounded"
        >
          Website
        </a>
        <time className="text-xs text-muted-foreground">
          {new Date(content.data.updated_at as string).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          )}
        </time>
      </div>
      <div className="prose mt-4">{content.result}</div>
    </div>
  );
}
