import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CreateNotePayload } from "@/types/note";

interface NoteDraftStore {
  draft: CreateNotePayload;
  setDraft: (note: CreateNotePayload) => void;
  clearDraft: () => void;
}

export const initialDraft: CreateNotePayload = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) => set({ draft: note }),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-hw-draft",
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);
