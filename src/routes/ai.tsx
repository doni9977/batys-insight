import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UploadCloud, Sparkles, FileText, AlertTriangle, CheckCircle2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "ИИ-Аналитик — BatysMonitor" },
      { name: "description", content: "AI-анализ документов и аномалий" },
    ],
  }),
  component: AiPage,
});

type Log = { time: string; severity: "critical" | "warning" | "ok"; text: string };

const LOGS: Log[] = [
  {
    time: "18.06.2026 · 09:42",
    severity: "critical",
    text: "Обнаружена аномалия: ТОО 'СтройИнвест' резко увеличило кредиторскую задолженность за последние 3 месяца. Вероятность банкротства 78%.",
  },
  {
    time: "18.06.2026 · 08:15",
    severity: "warning",
    text: "Найдены расхождения: В отчете ИП 'Актобе Трейд' не совпадают данные по НДС с базой КГД. Дельта: 2.4 млн ₸.",
  },
  {
    time: "17.06.2026 · 19:03",
    severity: "warning",
    text: "ТОО 'Чаган Транс' — выявлено систематическое снижение фонда оплаты труда на 18% при сохранении штата.",
  },
  {
    time: "17.06.2026 · 14:21",
    severity: "ok",
    text: "Проведён анализ 142 деклараций по КПН за май. Аномалий не выявлено.",
  },
];

const sevStyles: Record<Log["severity"], { ring: string; text: string; Icon: any }> = {
  critical: { ring: "border-red-500/40 bg-red-500/5", text: "text-red-300", Icon: AlertTriangle },
  warning: { ring: "border-amber-400/40 bg-amber-400/5", text: "text-amber-300", Icon: AlertTriangle },
  ok: { ring: "border-emerald-500/40 bg-emerald-500/5", text: "text-emerald-300", Icon: CheckCircle2 },
};

function AiPage() {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<string[]>([]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const list = Array.from(e.dataTransfer.files).map((f) => f.name);
    setFiles((prev) => [...prev, ...list]);
  };

  return (
    <>
      <PageHeader
        title="ИИ-Аналитик"
        subtitle="Автоматический разбор документов и обнаружение аномалий"
      />

      <div className="grid grid-cols-1 gap-6 p-8 xl:grid-cols-2">
        {/* Upload */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">
            Загрузка документов
          </h2>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={[
              "relative flex h-80 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition cyber-grid",
              dragging
                ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_40px_-10px_oklch(0.78_0.13_210/.8)]"
                : "border-white/15 bg-surface hover:border-cyan-400/40",
            ].join(" ")}
          >
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-700/20 border border-cyan-400/30">
              <UploadCloud className="h-8 w-8 text-cyan-300" />
            </div>
            <div>
              <p className="text-base font-medium text-white">Загрузите PDF или Excel отчеты для анализа ИИ</p>
              <p className="mt-1 text-xs text-slate-400">Перетащите файлы сюда или нажмите для выбора · до 50 МБ</p>
            </div>
            <button className="mt-2 rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 hover:bg-cyan-500/20">
              Выбрать файлы
            </button>
          </div>

          {files.length > 0 && (
            <ul className="mt-4 space-y-2">
              {files.map((f, i) => (
                <li key={i} className="flex items-center gap-3 rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm">
                  <FileText className="h-4 w-4 text-cyan-300" />
                  <span className="truncate text-slate-200">{f}</span>
                  <span className="ml-auto text-xs text-emerald-400">в обработке…</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 rounded-xl border border-white/10 bg-surface p-4">
            <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">Поддерживаемые форматы</div>
            <div className="flex flex-wrap gap-2 text-xs">
              {["PDF", "XLSX", "XLS", "CSV", "DOCX"].map((t) => (
                <span key={t} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-slate-300">{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Logs */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">
            Журнал AI-мониторинга
          </h2>
          <div className="space-y-3">
            {LOGS.map((log, i) => {
              const s = sevStyles[log.severity];
              return (
                <article key={i} className={`rounded-xl border p-4 ${s.ring}`}>
                  <header className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-md bg-cyan-500/15 border border-cyan-400/30">
                        <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                      </span>
                      <span className="text-xs font-mono text-slate-400">{log.time}</span>
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${s.text}`}>
                      <s.Icon className="h-3.5 w-3.5" />
                      {log.severity === "critical" ? "Критично" : log.severity === "warning" ? "Внимание" : "Норма"}
                    </span>
                  </header>
                  <p className="text-sm leading-relaxed text-slate-200">{log.text}</p>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
