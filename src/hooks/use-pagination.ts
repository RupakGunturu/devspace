import { useState, useMemo } from "react";

export function usePagination<T>(items: T[], perPage = 10) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, page, perPage]);

  const goTo = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));
  const prev = () => goTo(page - 1);
  const next = () => goTo(page + 1);

  return { page, totalPages, paginatedItems, goTo, prev, next, total: items.length };
}
