import type { Metadata } from "next";
//import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import { Roboto } from 'next/font/google';

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const roboto = Roboto({
  subsets: ['latin'], 
  weight: ['400', '700'],
  variable: '--font-roboto', 
  display: 'swap', 
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
        <div id="modal-root"></div> {/* ✅ ПЕРЕМІСТІТЬ НА ПОЧАТОК */}
        
        <TanStackProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          {modal}
        </TanStackProvider>
      </body>
    </html>
  );
}