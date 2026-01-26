"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounceValue } from "usehooks-ts";

import css from "./Notes.client.module.css";

import type { FetchNotesResponse } from "@/lib/api";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import SearchBox from "@/components/SearchBox/SearchBox";
import ErrorBox from "@/components/ErrorBox/ErrorBox";
import Loader from "@/components/Loader/Loader";

interface NotesPageProps {
  initialPage: number;
  initialSearch: string;
  tag?: string;
}

export default function NotesPage({
  initialPage,
  initialSearch,
  tag,
}: NotesPageProps) {
  const [page, setPage] = useState(initialPage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const [debauncedSearch] = useDebounceValue(search, 1000);

  const { data, isLoading, isError, error, isRefetching } =
    useQuery<FetchNotesResponse>({
      queryKey: ["notes", page, debauncedSearch, tag],
      queryFn: () => fetchNotes(page, debauncedSearch, tag),
      placeholderData: keepPreviousData,
      staleTime: 60 * 1000,
    });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox search={search} onChangeSearch={handleSearchChange} />

          {data?.totalPages && data?.totalPages > 1 ? (
            <Pagination
              totalPages={data?.totalPages ?? 0}
              page={page}
              setPage={setPage}
            />
          ) : null}

          <button onClick={() => setIsModalOpen(true)} className={css.button}>
            Create note +
          </button>
        </header>
        <div className={css.contentContainer}>
          {isLoading && <Loader />}

          {data && !isLoading && <NoteList notes={data.notes} />}

          {isRefetching && !isLoading && (
            <Modal onClose={() => setIsModalOpen(false)}>
              <Loader />
            </Modal>
          )}

          {isModalOpen && (
            <Modal onClose={() => setIsModalOpen(false)}>
              <NoteForm
                onFormClose={() => setIsModalOpen(false)}
                onCancelClick={() => setIsModalOpen(false)}
              />
            </Modal>
          )}

          {!isError && !isLoading && !data?.notes?.length && !isLoading && (
            <ErrorBox query={debauncedSearch} />
          )}
          {isError && <ErrorBox errorMessage={error.message} />}
        </div>
      </div>
    </div>
  );
}
