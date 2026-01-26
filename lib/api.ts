import axios from "axios";
import type { Note, CreateNote } from "@/types/note";
import { log } from "console";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export async function fetchSingleNoteById(id: string) {
  const response = await axios.get<Note>(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.data;
}

export async function fetchNotes(
  page?: number,
  searchQuery?: string,
  tag?: string,
) {
  const response = await axios.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage: 12,
      sortBy: "created",
      search: searchQuery,
      tag,
    },
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return response.data;
}

export async function createNote(payload: CreateNote): Promise<Note> {
  const response = await axios.post<Note>("/notes", payload, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.data;
}

export async function deleteNote(noteId: Note["id"]) {
  const response = await axios.delete<Note>(`/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return response.data;
}

export async function fetchTags() {
  const { notes } = await fetchNotes();

  if (notes.length === 0) return [];

  const tags = notes.reduce<string[]>((accu, note) => {
    if (!accu.includes(note.tag)) {
      accu.push(note.tag);
    }
    return accu;
  }, []);

  return tags;
}
