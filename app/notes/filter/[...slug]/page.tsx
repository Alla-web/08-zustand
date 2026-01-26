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
