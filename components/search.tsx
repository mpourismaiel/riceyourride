import { HiChevronUpDown } from "react-icons/hi2";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ProgramWithFilename } from "@/types/data";

const Search = ({ programs }: { programs: ProgramWithFilename[] }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (value) {
      router.push(`/rices/programs/${value}/1`);
    }
  }, [value, router]);

  return (
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
            ? programs.find((program) => program.filename === value)?.title
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
                value={program.filename + " " + program.categories.join(" ")}
                onSelect={(currentValue) => {
                  setValue(program.filename === value ? "" : program.filename);
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
  );
};

export default Search;
