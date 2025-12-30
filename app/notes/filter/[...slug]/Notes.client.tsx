"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import Link from "next/link";

import { fetchNotes } from "@/lib/lib/api/clientApi";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";

import css from "./App.module.css";

const PER_PAGE = 12;

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [debouncedSearch] = useDebounce(search, 300);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", { page, search: debouncedSearch, tag }],
    queryFn: () =>
      fetchNotes({
        search: debouncedSearch || undefined,
        page,
        perPage: PER_PAGE,
        sortBy: "created",
        tag: tag === "all" ? undefined : tag,
      }),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages ?? 1;
  const notes = data?.notes ?? [];

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // сброс страницы при изменении поиска
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        {/* ⬇️ теперь это ссылка на страницу создания */}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error</p>}
      {!isLoading && !isError && <NoteList notes={notes} />}
    </div>
  );
}
