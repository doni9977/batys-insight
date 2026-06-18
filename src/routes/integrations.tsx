import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "../components/PageHeader";
import { Download } from "lucide-react";

export const Route = createFileRoute("/integrations")({
  head: () => ({ meta: [{ title: "Интеграции — BatysMonitor" }] }),
  component: () => (
    <>
      <PageHeader title="Интеграции" subtitle="Подключение источников данных (КГД, ЕНПФ, Stat.gov)" />
      <div className="p-8">
        <div className="grid place-items-center rounded-xl border border-white/10 bg-surface p-16 text-center">
          <Download className="h-10 w-10 text-cyan-300" />
          <p className="mt-4 text-sm text-slate-400">Раздел в разработке</p>
        </div>
      </div>
    </>
  ),
});
