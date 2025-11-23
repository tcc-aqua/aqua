"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export function PaginationDemo({
  currentPage = 1,
  totalPages = 1,
  onChangePage,
  maxVisible = 5,
}) {
  const handlePageClick = (page) => {
    if (page < 1 || page > totalPages) return;
    onChangePage?.(page);
  };

  // Lógica de range
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = startPage + maxVisible - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  const visiblePages = [];
  for (let i = startPage; i <= endPage; i++) visiblePages.push(i);

  return (
    <Pagination className="my-6">
      <PaginationContent className="gap-2">

        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageClick(currentPage - 1);
            }}
            className={cn(
              "transition-all rounded-xl hover:bg-muted px-3 py-2",
              currentPage === 1 && "pointer-events-none opacity-40"
            )}
          />
        </PaginationItem>

        {startPage > 1 && (
          <>
            <PaginationItem>
              <PaginationLink
                href="#"
                className="rounded-xl transition-all hover:bg-muted px-4 py-2"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageClick(1);
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>
            {startPage > 2 && (
              <PaginationEllipsis className="opacity-60" />
            )}
          </>
        )}

        {visiblePages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageClick(page);
              }}
              isActive={page === currentPage}
              className={cn(
                "rounded-xl px-4 py-2 transition-all font-medium",
                "hover:bg-muted dark:hover:bg-muted/50",
                page === currentPage &&
                  "bg-primary text-primary-foreground shadow-sm scale-105"
              )}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <PaginationEllipsis className="opacity-60" />
            )}

            <PaginationItem>
              <PaginationLink
                href="#"
                className="rounded-xl transition-all hover:bg-muted px-4 py-2"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageClick(totalPages);
                }}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageClick(currentPage + 1);
            }}
            className={cn(
              "transition-all rounded-xl hover:bg-muted px-3 py-2",
              currentPage === totalPages && "pointer-events-none opacity-40"
            )}
          />
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  );
}
