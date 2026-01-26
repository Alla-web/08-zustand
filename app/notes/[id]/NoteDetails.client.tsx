"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import css from "./NoteDetails.module.css";

import { fetchSingleNoteById } from "@/lib/api";

import Modal from "@/components/Modal/Modal";
import Loader from "@/components/Loader/Loader";

export default function NoteDetails() {
  const [isOpen, setIsOpen] = useState(false);

  const { id } = useParams<{ id: string }>();

  const {
    data: note,
    error,
    isLoading,
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
    <div className={css.container}>
      {isLoading ? <Loader /> : null}
      {error && !note ? (
        <Modal onClose={() => setIsOpen(false)}>
          {
            <div className={css.error}>
              <p style={{ fontSize: "20px" }}>Could not fetch note details.</p>
              <p style={{ color: "black" }}>{error.message}</p>
            </div>
          }
        </Modal>
      ) : null}
      {note ? (
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>
            {note.createdAt
              ? formatDate(note.createdAt)
              : formatDate(note.updatedAt)}
          </p>
        </div>
      ) : null}
    </div>
  );
}
