"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId, useMemo } from "react";
import { useRouter } from "next/navigation";

import css from "./NoteForm.module.css";

import { createNote } from "@/lib/api";
import Loader from "../Loader/Loader";
import { useNoteDraftStore } from "@/lib/store/noteStore";
import { CreateNotePayload } from "@/types/note";
import { initialDraft } from "@/lib/store/noteStore";

const isEmptyDraft = (savedDraft: CreateNotePayload) =>
  savedDraft.title === "" && savedDraft.content === "";

export default function NoteForm() {
  const fieldId = useId();
  const queryClient = useQueryClient();
  const router = useRouter();

  const close = () => router.push("/notes/filter/all");

  const draft = useNoteDraftStore((state) => state.draft);
  const setDraft = useNoteDraftStore((state) => state.setDraft);
  const clearDraft = useNoteDraftStore((state) => state.clearDraft);

  const startValues = useMemo(
    () => (draft && !isEmptyDraft(draft) ? draft : initialDraft),
    [draft],
  );

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: (note) => {
      console.log(note);
      queryClient.invalidateQueries({
        queryKey: ["notes"],
        exact: false,
      });
      clearDraft();
      // useNoteDraftStore.persist.clearStorage();
      close();
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Unknown error!");
      }
    },
  });

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setDraft({
      ...startValues,
      ...draft,
      [name]: value,
    });
  };

  const handleCancel = () => {
    close();
  };

  const handleSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const tag = formData.get("tag") as string;

    mutate({ title, content, tag });
  };

  return (
    <>
      {isPending && <Loader />}
      {!isPending && (
        <form action={handleSubmit} className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-title`}>Title</label>
            <input
              id={`${fieldId}-title`}
              type="text"
              name="title"
              className={css.input}
              onChange={handleChange}
              value={startValues.title}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-content`}>Content</label>
            <textarea
              id={`${fieldId}-content`}
              name="content"
              rows={8}
              className={css.textarea}
              onChange={handleChange}
              value={startValues.content}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-tag`}>Tag</label>
            <select
              id={`${fieldId}-tag`}
              name="tag"
              className={css.select}
              onChange={handleChange}
              value={startValues.tag}
            >
              <option value="" disabled>
                -- Select tag --
              </option>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </select>
          </div>

          <div className={css.actions}>
            <button
              onClick={handleCancel}
              type="button"
              className={css.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={css.submitButton}>
              Create note
            </button>
          </div>
        </form>
      )}
    </>
  );
}
