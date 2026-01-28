import { Metadata } from "next";
import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

interface NotesByTagProps {
  searchParams: Promise<{ page?: string; search?: string }>;
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  searchParams,
  params,
}: NotesByTagProps): Promise<Metadata> {
  const sp = await searchParams;
  const page = Number(sp?.page ?? "1") || 1;
  const search = sp?.search || "";

  const { slug } = await params;
  const first = slug?.[0] ?? "all";
  const tag = first === "all" ? undefined : first;

  const titleBase = search ? `${tag} - search "${search}"` : tag;

  const title =
    page > 1
      ? `${titleBase} (page ${page}) | NoteHub`
      : `${titleBase} | Notehub`;

  const description = search
    ? `Browse notes in ${tag?.toLowerCase()} filtered by search "${search}"`
    : `Browse notes in ${tag?.toLowerCase()}`;

  const canonical = new URL(`https:notehub.com/filter/${first}`);
  if (search) canonical.searchParams.set("search", search);
  if (page > 1) canonical.searchParams.set("page", String(page));

  return {
    title,
    description,
    alternates: {
      canonical: canonical.toString(),
    },
    openGraph: {
      title,
      description,
      url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
      siteName: "NoteHub",
      type: "article",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://ac.goit.global/fullstack/react/og-meta.jpg"],
    },
  };
}

export default async function NotesByTag({
  searchParams,
  params,
}: NotesByTagProps) {
  const sp = await searchParams;
  const page = Number(sp?.page ?? "1") || 1;
  const search = sp?.search || "";

  const { slug } = (await params) ?? {};
  const first = slug?.[0] ?? "all";
  const tag = first === "all" ? undefined : first;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", page, search, tag],
    queryFn: () => fetchNotes(page, search, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialPage={page} initialSearch={search} tag={tag} />
    </HydrationBoundary>
  );
}
