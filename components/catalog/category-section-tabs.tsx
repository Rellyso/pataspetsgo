"use client";

import { useEffect, useState } from "react";
import { GridIcon } from "@/components/shared/icons";

type CategorySectionTab = {
  id: string;
  label: string;
};

type CategorySectionTabsProps = {
  sections: CategorySectionTab[];
  className?: string;
};

const topAnchorId = "catalog-results-top";

export function CategorySectionTabs({
  sections,
  className,
}: CategorySectionTabsProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? topAnchorId);

  useEffect(() => {
    if (sections.length === 0) {
      return;
    }

    const sectionElements = sections
      .map((section) => document.getElementById(section.id))
      .filter(
        (element): element is HTMLElement => element instanceof HTMLElement,
      );

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
          (left, right) =>
            left.boundingClientRect.top - right.boundingClientRect.top,
        );
        setActiveId(visibleEntries[0].target.id);
      },
      {
        rootMargin: "-148px 0px -58% 0px",
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
      className={["sticky top-18 z-30 overflow-hidden lg:hidden", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="-mx-4 border-b border-default bg-background/96 py-3 backdrop-blur-sm sm:-mx-6">
        <div className="overflow-x-auto px-4 [scrollbar-width:none] [-ms-overflow-style:none] sm:px-6 [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max min-w-full items-center gap-5 pr-4">
            <a
              aria-current={activeId === topAnchorId ? "location" : undefined}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-default bg-surface px-4 py-2 text-sm font-semibold text-foreground shadow-soft"
              href={`#${topAnchorId}`}
              onClick={() => setActiveId(topAnchorId)}
            >
              <GridIcon className="size-4 text-primary" />
              Categorias
            </a>

            {sections.map((section) => (
              <a
                key={section.id}
                aria-current={activeId === section.id ? "location" : undefined}
                className={[
                  "inline-flex min-h-11 items-center border-b-2 px-1 pb-2 pt-2 text-sm font-semibold whitespace-nowrap transition-colors duration-200",
                  activeId === section.id
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted hover:text-foreground",
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
