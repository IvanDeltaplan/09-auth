import type { Metadata } from "next";
import "./globals.css";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Note Hub",
  description: "This app will help you manage your notes efficiently.",
  openGraph: {
    title: "NoteHub - Manage all your notes easily",
    description: "Fast, simple and powerful note manager.",
    url: "https://08-zustand-vercel.vercel.app",
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

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
  <div id="modal-root" />
  <TanStackProvider>
    <AuthProvider>
      <Header />
      <main>
        {children}
        {modal}
      </main>
      <Footer />
    </AuthProvider>
  </TanStackProvider>
</body>

    </html>
  );
}
