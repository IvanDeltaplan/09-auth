// lib/store/noteStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const initialDraft = {
  title: "",
  content: "",
  tag: "Todo",
};

type Draft = typeof initialDraft;

type NoteStore = {
  draft: Draft;
  setDraft: (payload: Partial<Draft>) => void;
  clearDraft: () => void;
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,

      setDraft: (payload) =>
        set((state) => ({
          draft: { ...state.draft, ...payload },
        })),

      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft", // ключ в localStorage
    }
  )
);
