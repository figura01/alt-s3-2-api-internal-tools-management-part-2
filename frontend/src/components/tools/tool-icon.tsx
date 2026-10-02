"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Archive, ChartColumn, CodeXml, GitBranch, Megaphone, MessageCircle,
  MessagesSquare, NotebookPen, PenTool, Terminal, type LucideIcon,
} from "lucide-react";

type Props = { name: string; iconUrl?: string | null };
type Identity = { icon: LucideIcon; tone: string; logo?: string };

// Exact names only: a similarly named tool must not inherit another brand's logo.
const identities: Record<string, Identity> = {
  figma: { icon: PenTool, tone: "bg-purple-500/10 text-purple-600 dark:text-purple-300", logo: "/tool-icons/figma.png" },
  github: { icon: GitBranch, tone: "bg-slate-500/10 text-slate-700 dark:text-slate-200", logo: "/tool-icons/github.png" },
  notion: { icon: NotebookPen, tone: "bg-slate-500/10 text-slate-700 dark:text-slate-200" },
  chatgpt: { icon: MessageCircle, tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  codex: { icon: Terminal, tone: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300" },
  teamchat: { icon: MessagesSquare, tone: "bg-violet-500/10 text-violet-600 dark:text-violet-300" },
  codeforge: { icon: CodeXml, tone: "bg-blue-500/10 text-blue-600 dark:text-blue-300" },
  archivebox: { icon: Archive, tone: "bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  campaignflow: { icon: Megaphone, tone: "bg-rose-500/10 text-rose-600 dark:text-rose-300" },
  oldmetrics: { icon: ChartColumn, tone: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300" },
};
const fictionalNames = new Set(["teamchat", "codeforge", "archivebox", "campaignflow", "oldmetrics"]);

export function ToolIcon({ name, iconUrl }: Props) {
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const normalized = name.trim().toLowerCase();
  const withoutDemo = normalized.replace(/^demo\s+/, "");
  const identity = identities[fictionalNames.has(withoutDemo) ? withoutDemo : normalized];
  const custom = iconUrl?.trim();
  // Ignore the old placeholder and unsupported schemes before rendering an image.
  const customSource = custom && custom !== "/image-default.png" &&
    (/^https:\/\/[^/\s]+/i.test(custom) || /^\/(?!\/)/.test(custom)) ? custom : undefined;
  const source = [customSource, identity?.logo].find(src => src && !failedSources.includes(src));
  const Icon = identity?.icon;
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = (words.length > 1 ? words[0][0] + words[words.length - 1][0] : Array.from(words[0] ?? "?").slice(0, 2).join("")).toUpperCase();

  return (
    <span aria-hidden="true" title={name} className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/50 align-middle ${source ? "bg-white" : identity?.tone ?? "bg-primary/10 text-primary"}`}>
      {source ? (
        <Image key={source} src={source} alt="" width={24} height={24} unoptimized
          className="h-6 w-6 object-contain" referrerPolicy="no-referrer"
          onError={() => setFailedSources(previous => [...previous, source])} />
      ) : Icon ? <Icon className="h-5 w-5" strokeWidth={1.8} /> : (
        <span className="text-xs font-semibold">{initials}</span>
      )}
    </span>
  );
}
