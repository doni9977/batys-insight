import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Download, Filter, ArrowUpRight, Pencil, Trash2, ListFilter } from "lucide-react";
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

function RegistryPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [isDistrictHovered, setIsDistrictHovered] = useState(false);
  const perPage = 6;

  const districts = useMemo(() => Array.from(new Set(ROWS.map(r => r.district))), []);

  const filtered = useMemo(
    () => ROWS.filter((r) => {
      const matchQ = [r.bin, r.name, r.district].some((v) => v.toLowerCase().includes(q.toLowerCase()));
      const matchDistrict = selectedDistrict ? r.district === selectedDistrict : true;
      return matchQ && matchDistrict;
    }),
    [q, selectedDistrict]
  );
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const slice = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <PageHeader
        title="Реестр субъектов"
        subtitle={`${ROWS.length} компаний под мониторингом`}
        right={
          <button className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-body hover:bg-surface-2">
            <Download className="h-4 w-4" /> Экспорт CSV
          </button>
        }
      />

      <div className="p-8 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder="Поиск по БИН, названию или району..."
              className="w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-subtle focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="bg-surface overflow-visible rounded-xl p-6 border border-border shadow-sm">
          <div className="overflow-visible">
            <table className="w-full text-sm text-left text-body">
              <thead className="border-b border-border text-xs text-subtle bg-transparent">
                <tr>
                  <th className="py-5 font-medium w-16 text-center border-r border-border-subtle">#</th>
                  <th className="px-4 py-5 font-medium border-r border-border-subtle">
                    <div className="flex items-center justify-between gap-2">
                      Название
                      <div className="flex items-center gap-1">
                        <ListFilter className="h-3.5 w-3.5" />
                        <Filter className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </th>
                  <th className="px-4 py-5 font-medium border-r border-border-subtle">
                    <div className="flex items-center justify-between gap-2">
                      Уровень риска
                      <Filter className="h-3.5 w-3.5" />
                    </div>
                  </th>
                  <th className="px-4 py-5 font-medium border-r border-border-subtle">
                    <div className="flex items-center justify-between gap-2">
                      БИН
                      <div className="flex items-center gap-1">
                        <ListFilter className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </th>
                  <th 
                    className="px-4 py-5 font-medium relative border-r border-border-subtle"
                    onMouseEnter={() => setIsDistrictHovered(true)}
                    onMouseLeave={() => setIsDistrictHovered(false)}
                  >
                    <div className="flex items-center justify-between gap-2 cursor-pointer text-heading">
                      <span>Район {selectedDistrict && <span className="text-primary font-semibold">({selectedDistrict})</span>}</span>
                      <div className="flex items-center gap-1">
                        <Filter className="h-3.5 w-3.5 text-subtle" />
                      </div>
                    </div>
                    {isDistrictHovered && (
                      <div className="absolute top-[80%] left-6 z-[100] mt-1 w-48 rounded-lg border border-border bg-surface p-2 shadow-2xl dark:shadow-black/50 shadow-black/10">
                        <div
                          className={`cursor-pointer rounded-md px-3 py-2 text-sm transition-colors ${!selectedDistrict ? 'bg-primary/10 text-heading font-medium' : 'text-body hover:bg-surface-2 hover:text-heading'}`}
                          onClick={() => setSelectedDistrict(null)}
                        >
                          Все районы
                        </div>
                        {districts.map(d => (
                          <div
                            key={d}
                            className={`cursor-pointer rounded-md px-3 py-2 text-sm transition-colors mt-1 ${selectedDistrict === d ? 'bg-primary/10 text-heading font-medium' : 'text-body hover:bg-surface-2 hover:text-heading'}`}
                            onClick={() => setSelectedDistrict(d)}
                          >
                            {d}
                          </div>
                        ))}
                      </div>
                    )}
                  </th>
                  <th className="px-4 py-5 font-medium border-r border-border-subtle">Статус</th>
                  <th className="px-6 py-5 font-medium text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle bg-transparent">
                {slice.map((r, i) => (
                  <tr key={r.bin} className="hover:bg-surface-2/50 transition-colors">
                    <td className="py-4 text-center text-subtle font-medium border-r border-border-subtle">{(page - 1) * perPage + i + 1}</td>
                    <td className="px-4 py-4 text-heading font-medium border-r border-border-subtle">{r.name}</td>
                    <td className="px-4 py-4 border-r border-border-subtle">
                      <span className="flex items-center gap-2.5 text-body">
                        <span className={`h-2.5 w-2.5 rounded-full ${r.risk === 'critical' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : r.risk === 'warning' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'}`} />
                        {RISK_LABEL[r.risk]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-body font-mono border-r border-border-subtle">{r.bin}</td>
                    <td className="px-4 py-4 text-body border-r border-border-subtle">{r.district}</td>
                    <td className="px-4 py-4 text-subtle max-w-[200px] truncate border-r border-border-subtle">{r.status}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2.5">
                        <button className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-border bg-surface text-subtle hover:text-heading hover:bg-surface-2 hover:shadow-sm transition-all">
                          <ArrowUpRight className="h-[18px] w-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {slice.length === 0 && (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-subtle">Совпадений не найдено</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-border bg-transparent pt-4 mt-2 text-xs text-subtle">
            <span>Показано {slice.length} из {filtered.length}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-md border border-border p-1.5 hover:bg-surface-2 text-body disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="font-mono">{page} / {pages}</span>
              <button
                disabled={page === pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                className="rounded-md border border-border p-1.5 hover:bg-surface-2 text-body disabled:opacity-40 transition-colors"
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
