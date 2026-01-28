import { Metadata } from "next";

import NoteForm from "@/components/NoteForm/NoteForm";

import css from "./page.module.css";

export const metadata: Metadata = {
  title: "Create note page",
  description: "Page for entering title, content and tag to create a new note",
  openGraph: {
    title: "Create note page",
    description:
      "Page for entering title, content and tag to create a new note",
    url: "https://notehub.com/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Create note page",
      },
    ],
  },
};

export default async function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
