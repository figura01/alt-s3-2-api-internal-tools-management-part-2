import type { Metadata } from "next";
import PageContent from "./page-content";

export const metadata: Metadata = { title: "Dashboard" };

export default function Page() { return <PageContent />; }
