"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";
import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.module.css";
import type { Note } from "@/types/note";

export default function NotePreview() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data: note, isLoading, isError } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <Modal onClose={() => router.back()}>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error</p>}

      {note && (
        <div className={css.container}>
          <button className={css.backBtn} onClick={() => router.back()}>
            ← Back
          </button>

          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
              <span className={css.tag}>{note.tag}</span>
            </div>

            <div className={css.content}>{note.content}</div>

            <div className={css.date}>
              <div>Created: {new Date(note.createdAt).toLocaleString()}</div>
              {note.updatedAt && (
                <div>Updated: {new Date(note.updatedAt).toLocaleString()}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
