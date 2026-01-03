// app/notes/filter/[...slug]/page.tsx
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/serverApi";
import NotesClient from "./Notes.client";
import type { Metadata } from "next";

interface FilterPageProps {
  params: Promise<{ slug: string[] }>;
}

const PER_PAGE = 12;

// 👉 SEO + Open Graph для страницы списка по тегу
export async function generateMetadata(
  { params }: FilterPageProps
): Promise<Metadata> {
  const { slug } = await params;
  const tagFromUrl = slug?.[0] ?? "all";

  const humanTag =
    tagFromUrl === "all" ? "All notes" : `Tag: ${tagFromUrl}`;

  return {
    title: `NoteHub — ${humanTag}`,
    description:
      tagFromUrl === "all"
        ? "Browse all your notes in NoteHub."
        : `Browse notes filtered by tag "${tagFromUrl}" in NoteHub.`,
    openGraph: {
      title: `NoteHub — ${humanTag}`,
      description:
        tagFromUrl === "all"
          ? "Browse all your notes in NoteHub."
          : `Browse notes filtered by tag "${tagFromUrl}" in NoteHub.`,
      url: `08-zustand-vercel.vercel.app/filter/${tagFromUrl}`,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub notes list",
        },
      ],
      type: "website",
    },
  };
}

export default async function FilterPage({ params }: FilterPageProps) {
  const { slug } = await params;

  // тег из URL: /notes/filter/Todo, /notes/filter/all
  const tagFromUrl = slug?.[0] ?? "all";

  const queryClient = new QueryClient();

  const page = 1;
  const search = "";

  await queryClient.prefetchQuery({
    queryKey: ["notes", { page, search, tag: tagFromUrl }],
    queryFn: () =>
      fetchNotes({
        search: search || undefined,
        page,
        perPage: PER_PAGE,
        sortBy: "created",
        tag: tagFromUrl === "all" ? undefined : tagFromUrl,
      }),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient tag={tagFromUrl} />
    </HydrationBoundary>
  );
}
