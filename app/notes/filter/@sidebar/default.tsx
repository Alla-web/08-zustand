// "use client";

import Link from "next/link";
import css from "./default.module.css";

import { fetchTags } from "@/lib/api";

export default async function SidebarNotes() {
  const tags = await fetchTags();

  return (
    <ul className={css.menuList}>
      <li className={css.menuItem}>
        <Link href="/notes/actions/create" className={css.menuLink}>
          Create note
        </Link>
      </li>
      <li className={css.menuItem}>
        <Link href={`/notes/filter/all`} className={css.menuLink}>
          All notes
        </Link>
      </li>
      {tags.length > 0
        ? tags.map((tag) => (
            <li key={tag} className={css.menuItem}>
              <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
                {tag}
              </Link>
            </li>
          ))
        : null}
    </ul>
  );
}
