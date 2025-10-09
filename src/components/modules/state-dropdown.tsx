"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryStates } from "@/hooks/use-location";
import debounce from "lodash/debounce";
import { Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type StateDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  countryId?: number;
  limit?: number;
};

export function StateDropdown({
  value,
  onChange,
  placeholder = "Select State",
  disabled = false,
  countryId,
  limit,
}: StateDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const debouncedSetter = useMemo(
    () => debounce((val: string) => setDebouncedSearch(val), 1000),
    []
  );

  useEffect(() => {
    debouncedSetter(search);
    return () => {
      debouncedSetter.cancel();
    };
  }, [search, debouncedSetter]);

  const queryParams: {
    countryId?: number;
    limit?: number;
    search?: string;
  } = {};
  if (countryId) queryParams.countryId = countryId;
  if (limit) queryParams.limit = limit;
  if (debouncedSearch) queryParams.search = debouncedSearch;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useQueryStates(queryParams);

  const items = data?.pages.flatMap(p => p.data ?? []) ?? [];
  const selected = items.find(s => s.id === Number(value));

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between"
          disabled={disabled}
        >
          {selected?.name || placeholder}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[var(--radix-dropdown-menu-trigger-width)] max-w-[var(--radix-dropdown-menu-trigger-width)] min-w-[var(--radix-dropdown-menu-trigger-width)] overflow-hidden p-0"
        align="start"
      >
        <Command>
          <CommandInput
            placeholder="Type a state or search..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList
            onScroll={e => {
              const el = e.currentTarget;
              if (
                hasNextPage &&
                !isFetchingNextPage &&
                el.scrollTop + el.clientHeight >= el.scrollHeight - 24
              ) {
                void fetchNextPage();
              }
            }}
          >
            <CommandEmpty>
              {items.length === 0
                ? "No results found."
                : "No matches. Try a different search."}
            </CommandEmpty>
            <CommandGroup>
              {items.map(s => (
                <CommandItem
                  key={s.id}
                  value={`${s.name} ${"country_code" in s ? String((s as { country_code?: string }).country_code ?? "") : ""}`}
                  onSelect={() => {
                    onChange(String(s.id));
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between"
                >
                  <span className="truncate">{s.name}</span>
                  {Number(value) === s.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
