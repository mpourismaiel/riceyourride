export type StaticPathsReturn<PageParams = Record<string, string>> = {
  paths: { params: PageParams }[];
  fallback: boolean;
};

export type SSGParams<PageParams = Record<string, string>> = {
  params: PageParams;
};

export type SSGProps<PageProps = Record<string, string>> = {
  props: PageProps;
};
