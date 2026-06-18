import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { PageHeader } from "../components/PageHeader";

export const Route = createFileRoute("/registry")({
  head: () => ({
    meta: [
      { title: "Реестр субъектов — BatysMonitor" },
      { name: "description", content: "Реестр мониторируемых компаний ЗКО" },
    ],
  }),
  component: RegistryPage,
});

type Risk = "critical" | "warning" | "ok";
type Row = { bin: string; name: string; district: string; risk: Risk; status: string };

const ROWS: Row[] = [
  { bin: "110240001234", name: 'ТОО "Орал Пром"', district: "Уральск", risk: "critical", status: "Налоговая задолженность 45 млн ₸" },
  { bin: "150840009876", name: 'АО "Запад Энерго"', district: "Бурлинский", risk: "warning", status: "Сокращение штата на 15%" },
  { bin: "210140005555", name: 'ИП "Жайык Логистик"', district: "Байтерек", risk: "ok", status: "Нарушений нет" },
  { bin: "190340002221", name: 'ТОО "СтройИнвест ЗКО"', district: "Акжаикский", risk: "critical", status: "Рост кредиторской задолженности +78%" },
  { bin: "180240001111", name: 'ТОО "Чаган Транс"', district: "Уральск", risk: "warning", status: "Просрочка платежей поставщикам" },
  { bin: "160740004444", name: 'ТОО "Аксай Нефть Сервис"', district: "Бурлинский", risk: "warning", status: "Снижение оборота на 22%" },
  { bin: "170940007777", name: 'ТОО "Урал Агро"', district: "Байтерек", risk: "ok", status: "Стабильные показатели" },
  { bin: "200540003333", name: 'ТОО "БатысСтрой"', district: "Уральск", risk: "critical", status: "Долг по КПН и НДС — 12 млн ₸" },
  { bin: "130140008888", name: 'ИП "Актобе Трейд"', district: "Уральск", risk: "warning", status: "Расхождения по НДС с базой КГД" },
  { bin: "220740009999", name: 'ТОО "Жайык Девелопмент"', district: "Уральск", risk: "ok", status: "Без замечаний" },
];

const RISK_LABEL: Record<Risk, string> = { critical: "Критично", warning: "Внимание", ok: "Штатно" };
const RISK_TEXT: Record<Risk, string> = {
  critical: "text-red-300",
  warning: "text-amber-300",
  ok: "text-emerald-300",
};

function RegistryPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered = useMemo(
    () => ROWS.filter((r) =>
      [r.bin, r.name, r.district].some((v) => v.toLowerCase().includes(q.toLowerCase()))
    ),
    [q]
  );
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const slice = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <PageHeader
        title="Реестр субъектов"
        subtitle={`${ROWS.length} компаний под мониторингом`}
        right={
          <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-slate-200 hover:bg-surface-2">
            <Download className="h-4 w-4" /> Экспорт CSV
          </button>
        }
      />

      <div className="p-8 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder="Поиск по БИН, названию или району..."
              className="w-full rounded-lg border border-white/10 bg-surface pl-9 pr-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>
          <div className="flex gap-2 text-xs">
            {(["critical", "warning", "ok"] as Risk[]).map((r) => (
              <span key={r} className="flex items-center gap-2 rounded-full border border-white/10 bg-surface px-3 py-1 text-slate-300">
                <span className={`risk-marker ${r} h-2.5 w-2.5`} /> {RISK_LABEL[r]}
              </span>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-surface">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3 text-left font-medium">БИН</th>
                <th className="px-5 py-3 text-left font-medium">Название</th>
                <th className="px-5 py-3 text-left font-medium">Район</th>
                <th className="px-5 py-3 text-left font-medium">Уровень риска</th>
                <th className="px-5 py-3 text-left font-medium">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {slice.map((r) => (
                <tr key={r.bin} className="transition hover:bg-white/[0.03]">
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-300">{r.bin}</td>
                  <td className="px-5 py-3.5 font-medium text-white">{r.name}</td>
                  <td className="px-5 py-3.5 text-slate-300">{r.district}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-2 ${RISK_TEXT[r.risk]}`}>
                      <span className={`risk-marker ${r.risk} h-2.5 w-2.5`} /> {RISK_LABEL[r.risk]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300">{r.status}</td>
                </tr>
              ))}
              {slice.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-500">Совпадений не найдено</td></tr>
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-between border-t border-white/5 px-5 py-3 text-xs text-slate-400">
            <span>Показано {slice.length} из {filtered.length}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-md border border-white/10 p-1.5 hover:bg-white/5 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="font-mono">{page} / {pages}</span>
              <button
                disabled={page === pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                className="rounded-md border border-white/10 p-1.5 hover:bg-white/5 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
