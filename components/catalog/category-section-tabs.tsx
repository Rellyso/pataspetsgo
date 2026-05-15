"use client";

import { useEffect, useState } from "react";

type CategorySectionTab = {
  id: string;
  label: string;
};

type CategorySectionTabsProps = {
  sections: CategorySectionTab[];
  className?: string;
};

const topAnchorId = "catalog-results-top";

export function CategorySectionTabs({ sections, className }: CategorySectionTabsProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? topAnchorId);

  useEffect(() => {
    if (sections.length === 0) {
      return;
    }

    const sectionElements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element instanceof HTMLElement);

    if (sectionElements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length === 0) {
          return;
        }

        visibleEntries.sort(
          (left, right) => left.boundingClientRect.top - right.boundingClientRect.top,
        );
        setActiveId(visibleEntries[0].target.id);
      },
      {
        rootMargin: "-132px 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5],
      },
    );

    for (const sectionElement of sectionElements) {
      observer.observe(sectionElement);
    }

    return () => {
      observer.disconnect();
    };
  }, [sections]);

  return (
    <div
      className={["sticky top-0 z-30 overflow-hidden xl:hidden", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="-mx-4 border-y border-default bg-background/95 py-3 backdrop-blur-sm sm:-mx-6">
        <div className="overflow-x-auto px-4 [scrollbar-width:none] [-ms-overflow-style:none] sm:px-6 [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max min-w-full gap-2 pr-4">
            <a
              className={[
                "inline-flex min-h-10 items-center justify-center rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200",
                activeId === topAnchorId
                  ? "border-primary bg-primary text-white shadow-soft"
                  : "border-default bg-surface text-muted hover:border-primary-light hover:bg-primary-light/50 hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
              ].join(" ")}
              href={`#${topAnchorId}`}
              onClick={() => setActiveId(topAnchorId)}
            >
              Tudo
            </a>

            {sections.map((section) => (
              <a
                key={section.id}
                className={[
                  "inline-flex min-h-10 items-center justify-center rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200",
                  activeId === section.id
                    ? "border-primary bg-primary text-white shadow-soft"
                    : "border-default bg-surface text-muted hover:border-primary-light hover:bg-primary-light/50 hover:text-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
                ].join(" ")}
                href={`#${section.id}`}
                onClick={() => setActiveId(section.id)}
              >
                {section.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
