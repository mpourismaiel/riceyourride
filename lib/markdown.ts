import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import extract from "remark-extract-frontmatter";
import yaml from "yaml";
import rehypeReact from "rehype-react";
import * as prod from "react/jsx-runtime";
import remarkRehype from "remark-rehype";
import rehypePrism from "@mapbox/rehype-prism";

const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs };

export const markdownToJsx = () =>
  unified()
    .use(remarkParse)
    .use(remarkFrontmatter, "yaml")
    .use(extract, { yaml: yaml.parse })
    .use(remarkRehype)
    .use(rehypePrism)
    .use(rehypeReact, production as any);
