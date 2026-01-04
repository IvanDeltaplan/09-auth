import { cookies } from "next/headers";
import { api } from "./api";
import type { FetchNotesParams } from "./clientApi";
import type { AxiosResponse } from "axios";

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
// ✅ нужно вернуть полный AxiosResponse, а не только data
export async function checkSession(): Promise<AxiosResponse<{ success: boolean }>> {
  return api.get("/auth/session", {
    headers: await cookieHeader(),
  });
}

/* ========= USER (server) ========= */
export async function getMe() {
  const { data } = await api.get("/users/me", {
    headers: await cookieHeader(),
  });
  return data;
}
