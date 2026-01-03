// app/notes/[id]/page.tsx
import type { Metadata } from "next";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/serverApi";
import NoteDetailsClient from "./NoteDetails.client";
import type { Note } from "@/types/note";

interface NoteDetailsPageProps {
  params: Promise<{ id: string }>;
}

// SEO + Open Graph для страницы конкретной заметки
export async function generateMetadata(
  { params }: NoteDetailsPageProps
): Promise<Metadata> {
  const { id } = await params;
  const note: Note = await fetchNoteById(id);

  const shortDescription =
    note.content.length > 30
      ? note.content.slice(0, 30) + "..."
      : note.content;

  const ogDescription =
    note.content.length > 100
      ? note.content.slice(0, 100) + "..."
      : note.content;

  return {
    title: `Note: ${note.title}`,
    description: shortDescription,
    openGraph: {
      title: `Note: ${note.title}`,
      description: ogDescription,
      url: `08-zustand-vercel.vercel.app/notes/${id}`, 
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
      type: "article",
    },
  };
}

// SSR-компонент
export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  // Prefetch нотатки до рендера
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
