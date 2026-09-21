import type { Metadata } from "next";
import PageContent from "./page-content";

export const metadata: Metadata = { title: "Edit Tool" };

export default function Page(props: { params: Promise<{ idTool: string }> }) { return <PageContent {...props} />; }
