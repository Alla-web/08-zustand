"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { fetchSingleNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";

import css from "./NotePreview.module.css";

export default function NotesPreview() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchSingleNoteById(id),
    refetchOnMount: false,
  });

  function formatDate(dateString: string) {
    return new Intl.DateTimeFormat("uk-UA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  }

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {(error || !note) && (
        <div>
          <h2>Error occured:</h2>
          <p>{error?.message}</p>
        </div>
      )}
      {note ? (
        <Modal onClose={() => router.back()}>
          <div className={css.notePreviewContainer}>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            <h3>Tag: {note.tag.toLowerCase()}</h3>
            <p className={css.noteDate}>
              {note.updatedAt
                ? formatDate(note.updatedAt)
                : formatDate(note.createdAt)}
            </p>
            <button className={css.goBackBtn} onClick={() => router.back()}>
              Go back
            </button>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
