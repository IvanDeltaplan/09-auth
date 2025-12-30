// app/not-found.tsx

import type { Metadata } from "next";
import css from "./Home.module.css";

export const metadata: Metadata = {
  title: "Page not found — NoteHub",
  description: "The page you are trying to access does not exist.",
  openGraph: {
    title: "404 — Page not found",
    description: "The page you are looking for does not exist on NoteHub.",
    url: "08-zustand-vercel.vercel.app/not-found",
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};






const NotFound = () => {
  return (
    <div>
      <h1 className={css.title}>404 - Page not found</h1>
<p className={css.description}>Sorry, the page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;

