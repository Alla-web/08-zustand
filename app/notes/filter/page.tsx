import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Notes",
  description: "All notes list page",
};

export function Notes() {
  redirect("/notes/filter/all");

  return null;
}
