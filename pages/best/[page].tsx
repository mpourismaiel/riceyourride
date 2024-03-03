import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiChevronUpDown } from "react-icons/hi2";

import RicePick from "@/components/rice-pick";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getAllRices, getRiceForPage } from "@/lib/rices";
import { PickAPI, Program } from "@/types/data";
import { SSGParams, SSGProps, StaticPathsReturn } from "@/types/next";
import { markdownToJsx } from "@/lib/markdown";
import { getAllPrograms, getProgram } from "@/lib/programs";
import Head from "next/head";
import { PageTitle } from "@/lib/site";

type RicePickParams = {
  page: string;
};

const PAGE_SIZE = 10;

export const getStaticPaths = async (): Promise<
  StaticPathsReturn<RicePickParams>
> => {
  const totalPages = Math.ceil(getAllRices().length / PAGE_SIZE);
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    params: { page: (i + 1).toString() },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = ({
  params: { page },
}: SSGParams<RicePickParams>): SSGProps<{
  page: string;
  picks: PickAPI[];
  programs: (Program & { filename: string })[];
}> => {
  const picks = getRiceForPage(getAllRices(), page, PAGE_SIZE);
  const programs = getAllPrograms().map((filename) => {
    const program = filename.replace(/\.md$/, "");
    const content = getProgram(program);
    const data = markdownToJsx().processSync(content).data as Program;
    return { ...data, filename: program };
  });
  return { props: { page, picks, programs } };
};

export default function Best({
  page,
  picks,
  programs,
}: {
  page: string;
  picks: PickAPI[];
  programs: (Program & { filename: string })[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (value) {
      router.push(`/rices/programs/${value}/1`);
    }
  }, [value, router]);

  return (
    <main>
      <Head>
        <title>{PageTitle(`Best Rices - Page ${page}`)}</title>
      </Head>
      <div className="flex gap-2 justify-between items-center mb-4 mt-8">
        <h1 className="text-2xl font-bold text-foreground">Best Picks</h1>
        <div className="flex items-center gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                role="combobox"
                aria-expanded={open}
                size="sm"
                className="w-[300px] justify-between"
              >
                {value
                  ? programs.find((program) => program.filename === value)
                      ?.title
                  : "Search by program..."}
                <HiChevronUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder="Search programs..." />
                <CommandEmpty>No program found.</CommandEmpty>
                <CommandGroup>
                  {programs.map((program) => (
                    <CommandItem
                      key={program.filename}
                      value={
                        program.filename + " " + program.categories.join(" ")
                      }
                      onSelect={(currentValue) => {
                        setValue(
                          program.filename === value ? "" : program.filename
                        );
                        setOpen(false);
                      }}
                    >
                      <div className="flex flex-col">
                        <span>{program.title}</span>
                        <span className="text-muted-foreground text-xs">
                          {program.categories.join(", ")}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-8">
        {picks.map((pick) => (
          <RicePick key={pick.id} pick={pick} />
        ))}
      </div>
    </main>
  );
}
