export interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteStorePayload {
  title: string;
}

export const NOTE_TAGS = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
] as const;

export type NoteTag = (typeof NOTE_TAGS)[number];

