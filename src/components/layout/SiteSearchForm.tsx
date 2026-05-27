"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { SearchSuggestion } from "@/services/search.service";

export function SiteSearchForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const trimmedQuery = useMemo(() => query.trim(), [query]);
  const allResultsHref = trimmedQuery.length >= 2 ? `/search?q=${encodeURIComponent(trimmedQuery)}` : "";
  const optionCount = suggestions.length + (allResultsHref ? 1 : 0);

  useEffect(() => {
    if (trimmedQuery.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          setSuggestions([]);
          return;
        }

        const payload = await response.json() as { suggestions?: SearchSuggestion[] };
        setSuggestions(payload.suggestions ?? []);
        setActiveIndex(-1);
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [trimmedQuery]);

  const showPanel = isFocused && trimmedQuery.length >= 2;

  function closePanel(): void {
    setIsFocused(false);
    setActiveIndex(-1);
  }

  function getActiveHref(): string {
    if (activeIndex >= 0 && activeIndex < suggestions.length) {
      return suggestions[activeIndex]?.href ?? "";
    }

    if (activeIndex === suggestions.length) {
      return allResultsHref;
    }

    return "";
  }

  return (
    <div className="relative w-full">
      <form action="/search" className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 dark:border-slate-800 dark:bg-slate-950">
        <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
        <input
          aria-label="Pretraga sajta"
          autoComplete="off"
          className="w-full min-w-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
          name="q"
          onBlur={() => {
            window.setTimeout(closePanel, 120);
          }}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            setActiveIndex(-1);

            if (nextQuery.trim().length < 2) {
              setSuggestions([]);
              setIsLoading(false);
            }
          }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              closePanel();
              return;
            }

            if (!showPanel || optionCount === 0) {
              return;
            }

            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((currentIndex) => (currentIndex + 1) % optionCount);
              return;
            }

            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((currentIndex) => (currentIndex <= 0 ? optionCount - 1 : currentIndex - 1));
              return;
            }

            if (event.key === "Enter") {
              const href = getActiveHref();

              if (href) {
                event.preventDefault();
                closePanel();
                router.push(href);
              }
            }
          }}
          placeholder="Pretraga"
          type="search"
          value={query}
        />
        <button className="sr-only" type="submit">
          Pretrazi
        </button>
      </form>

      {showPanel ? (
        <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950 lg:min-w-[360px]">
          {isLoading ? (
            <p className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">Pretrazujem...</p>
          ) : suggestions.length > 0 ? (
            <div className="max-h-[70vh] overflow-y-auto p-2 lg:max-h-80">
              {suggestions.map((suggestion, index) => (
                <Link
                  key={`${suggestion.type}-${suggestion.id}`}
                  className={`block rounded-2xl px-3 py-2 transition ${activeIndex === index ? "bg-slate-100 dark:bg-slate-900" : "hover:bg-slate-100 dark:hover:bg-slate-900"}`}
                  href={suggestion.href}
                  onClick={closePanel}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{suggestion.label}</p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">{suggestion.meta}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                      {suggestion.type}
                    </span>
                  </div>
                </Link>
              ))}
              <Link
                className={`mt-1 block rounded-2xl px-3 py-2 text-sm font-semibold text-grass-700 transition dark:text-grass-300 ${activeIndex === suggestions.length ? "bg-grass-50 dark:bg-grass-950/30" : "hover:bg-grass-50 dark:hover:bg-grass-950/30"}`}
                href={allResultsHref}
                onClick={closePanel}
                onMouseEnter={() => setActiveIndex(suggestions.length)}
              >
                Svi rezultati za &quot;{trimmedQuery}&quot;
              </Link>
            </div>
          ) : (
            <p className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">Nema rezultata.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
