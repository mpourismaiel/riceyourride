export type Pick = {
  id: number;
  reddit_username: string;
  github_username: string;
  post_url: string;
  dotfiles: string;
  dotfiles_at_pick?: string;
  date: string;
  wm: string;
  programs: string[];
  screenshots: string[];
  title: string;
};

export type PickAPI = Omit<Pick, "wm" | "programs"> & {
  wm: { url: string; title: string };
  programs: { url: string; title: string }[];
};

export type Program = {
  title: string;
  categories: string[];
  created_at: string;
  updated_at: string;
};

export type Link = Record<string, string>;
