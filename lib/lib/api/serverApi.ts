import { cookies } from "next/headers";
import { api } from "./api";
import type { FetchNotesParams } from "./clientApi";

async function cookieHeader() {
  const cookieStore = await cookies(); // важно: await
  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  return cookieString ? { Cookie: cookieString } : {};
}

/* ========= NOTES (server) ========= */
export async function fetchNotes(params: FetchNotesParams) {
  const { data } = await api.get("/notes", {
    params,
    headers: await cookieHeader(),
  });
  return data;
}

export async function fetchNoteById(id: string) {
  const { data } = await api.get(`/notes/${id}`, {
    headers: await cookieHeader(),
  });
  return data;
}

/* ========= AUTH (server) ========= */
export async function checkSession() {
  const { data } = await api.get("/auth/session", {
    headers: await cookieHeader(),
  });
  return data;
}

/* ========= USER (server) ========= */
export async function getMe() {
  const { data } = await api.get("/users/me", {
    headers: await cookieHeader(),
  });
  return data;
}
