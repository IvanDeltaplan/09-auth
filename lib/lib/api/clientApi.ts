import { api } from "./api";
import type { User } from "@/types/user";

/* ========= NOTES ========= */
export type FetchNotesParams = {
  page: number;
  perPage: number;
  search?: string;
  sortBy?: string;
  tag?: string;
};

export async function fetchNotes(params: FetchNotesParams) {
  const { data } = await api.get("/notes", { params });
  return data;
}

export async function fetchNoteById(id: string) {
  const { data } = await api.get(`/notes/${id}`);
  return data;
}

export async function createNote(payload: Record<string, unknown>) {
  const { data } = await api.post("/notes", payload);
  return data;
}

export async function deleteNote(id: string) {
  const { data } = await api.delete(`/notes/${id}`);
  return data;
}

/* ========= AUTH ========= */
// ✅ register принимает ТОЛЬКО email + password (как говорит ваш backend)
export type RegisterPayload = {
  email: string;
  password: string;
};

export async function register(payload: RegisterPayload) {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

export type LoginPayload = {
  email: string;
  password: string;
};

export async function login(payload: LoginPayload) {
  const { data } = await api.post("/auth/login", payload);
  return data;
}

export async function logout() {
  const { data } = await api.post("/auth/logout");
  return data;
}

export async function checkSession() {
  const { data } = await api.get("/auth/session");
  return data;
}

/* ========= USER ========= */
export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export type UpdateMePayload = Partial<Pick<User, "username" | "avatar">>;

export async function updateMe(payload: UpdateMePayload): Promise<User> {
  const { data } = await api.patch<User>("/users/me", payload);
  return data;
}
