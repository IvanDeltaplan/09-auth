// app/notes/filter/@sidebar/default.tsx
import css from "./SidebarNotes.module.css";
import Link from "next/link";
import { NOTE_TAGS } from "@/types/note";

const TAGS_WITH_ALL = ["all", ...NOTE_TAGS];

export default function SidebarNotes() {
  return (
    <ul className={css.menuList}>
      {TAGS_WITH_ALL.map((tag) => (
        <li key={tag} className={css.menuItem}>
          <Link
            href={`/notes/filter/${tag}`}
            className={css.menuLink}
          >
            {tag === "all" ? "All notes" : tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}

