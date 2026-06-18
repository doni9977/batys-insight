import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Calendar, AlertTriangle, ArrowRight, Filter, X } from "lucide-react";
import { PageHeader } from "../components/PageHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Карта рисков — BatysMonitor" },
      { name: "description", content: "Интерактивная карта экономических рисков Западно-Казахстанской области" },
    ],
  }),
  component: MapPage,
});

type Risk = "critical" | "warning" | "ok";
type Marker = {
  id: string;
  name: string;
  bin: string;
  district: string;
  risk: Risk;
  debt?: string;
  note: string;
  lat: number;
  lng: number;
};

const MARKERS: Marker[] = [
  { id: "1", name: 'ТОО "БатысСтрой"', bin: "110240001234", district: "Уральск", risk: "critical", debt: "12 млн ₸", note: "Налоговая задолженность по КПН и НДС", lat: 51.2333, lng: 51.3667 },
  { id: "2", name: 'ТОО "Орал Пром"', bin: "110240001235", district: "Уральск", risk: "critical", debt: "45 млн ₸", note: "Задолженность по заработной плате", lat: 51.2210, lng: 51.3920 },
  { id: "3", name: 'АО "Запад Энерго"', bin: "150840009876", district: "Бурлинский (Аксай)", risk: "warning", debt: "3.2 млн ₸", note: "Сокращение штата на 15%", lat: 51.1700, lng: 53.0000 },
  { id: "4", name: 'ТОО "Аксай Нефть Сервис"', bin: "150840009877", district: "Бурлинский (Аксай)", risk: "warning", note: "Снижение оборота на 22%", lat: 51.1620, lng: 52.9810 },
  { id: "5", name: 'ИП "Жайык Логистик"', bin: "210140005555", district: "Байтерек", risk: "ok", note: "Нарушений нет", lat: 51.0900, lng: 51.6500 },
  { id: "6", name: 'ТОО "Урал Агро"', bin: "210140005556", district: "Байтерек", risk: "ok", note: "Стабильные показатели", lat: 51.0500, lng: 51.7200 },
  { id: "7", name: 'ТОО "СтройИнвест ЗКО"', bin: "190340002221", district: "Акжаикский", risk: "critical", debt: "8.7 млн ₸", note: "Рост кредиторской задолженности +78%", lat: 50.8700, lng: 51.7900 },
  { id: "8", name: 'ТОО "Чаган Транс"', bin: "180240001111", district: "Уральск", risk: "warning", note: "Просрочка платежей поставщикам", lat: 51.2150, lng: 51.3500 },
];

const RISK_COLOR: Record<Risk, string> = {
  critical: "critical",
  warning: "warning",
  ok: "ok",
};

function MapPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ taxes: true, salaries: true, courts: true });
  const [selected, setSelected] = useState<Marker | null>(MARKERS[0]);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    let map: any;
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled) return;
      const el = document.getElementById("risk-map");
      if (!el || (el as any)._leaflet_id) return;

      map = L.map(el, {
        center: [51.15, 51.9],
        zoom: 8,
        zoomControl: true,
        attributionControl: true,
      });
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { maxZoom: 19, attribution: "&copy; OpenStreetMap &copy; CARTO" }
      ).addTo(map);

      MARKERS.forEach((m) => {
        const icon = L.divIcon({
          className: "",
          html: `<div class="risk-marker ${RISK_COLOR[m.risk]}"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        const marker = L.marker([m.lat, m.lng], { icon }).addTo(map);
        marker.on("click", () => setSelected(m));
        marker.bindTooltip(m.name, {
          direction: "top",
          offset: [0, -10],
          className: "!bg-slate-900 !text-white !border-white/10 !rounded-md !px-2 !py-1 !text-xs",
        });
      });

      setMapReady(true);
    })();
    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, []);

  return (
    <>
      <PageHeader
        title="Карта рисков"
        subtitle="Западно-Казахстанская область · оперативный мониторинг"
        right={
          <div className="flex items-center gap-3">
            <div className="relative w-[420px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                placeholder="Поиск по названию ТОО или БИН..."
                className="w-full rounded-lg border border-white/10 bg-surface pl-9 pr-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-slate-300">
              <Calendar className="h-4 w-4 text-cyan-300" />
              <span className="font-mono tracking-wide">18 Июн 2026</span>
            </div>
          </div>
        }
      />

      <div className="relative h-[calc(100vh-89px)] w-full">
        <div id="risk-map" className="absolute inset-0 cyber-grid" />

        {!mapReady && (
          <div className="absolute inset-0 grid place-items-center text-slate-500 text-sm">
            Загрузка карты...
          </div>
        )}

        {/* Right floating panel */}
        <div className="pointer-events-none absolute right-6 top-6 bottom-6 z-[400] w-[320px]">
          <div className="pointer-events-auto flex h-full flex-col gap-4 overflow-hidden">
            {/* Filters */}
            <section className="rounded-xl border border-white/10 bg-slate-900/80 p-4 backdrop-blur-xl shadow-2xl shadow-black/40">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/90">
                <Filter className="h-3.5 w-3.5" /> Фильтры
              </div>
              <div className="space-y-2">
                {([
                  ["taxes", "Налоги"],
                  ["salaries", "Зарплаты"],
                  ["courts", "Суды"],
                ] as const).map(([k, label]) => (
                  <label key={k} className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-sm text-slate-200 hover:bg-white/5">
                    <input
                      type="checkbox"
                      checked={filters[k]}
                      onChange={(e) => setFilters((f) => ({ ...f, [k]: e.target.checked }))}
                      className="h-4 w-4 accent-cyan-400"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </section>

            {/* Indicators */}
            <section className="rounded-xl border border-white/10 bg-slate-900/80 p-4 backdrop-blur-xl shadow-2xl shadow-black/40">
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/90">
                Индикаторы
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-3"><span className="risk-marker critical h-3 w-3" /> Критично</li>
                <li className="flex items-center gap-3"><span className="risk-marker warning h-3 w-3" /> Внимание</li>
                <li className="flex items-center gap-3"><span className="risk-marker ok h-3 w-3" /> Штатно</li>
              </ul>
            </section>

            {/* Details */}
            <section className="flex-1 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/80 p-4 backdrop-blur-xl shadow-2xl shadow-black/40">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/90">Детализация</div>
                {selected && (
                  <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {selected ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className={`risk-marker ${RISK_COLOR[selected.risk]} mt-1.5 h-3 w-3`} />
                    <div>
                      <div className="text-sm font-semibold text-white">{selected.name}</div>
                      <div className="font-mono text-xs text-slate-400">БИН {selected.bin}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-md bg-white/5 p-2">
                      <div className="text-slate-500">Район</div>
                      <div className="text-slate-200">{selected.district}</div>
                    </div>
                    <div className="rounded-md bg-white/5 p-2">
                      <div className="text-slate-500">Уровень</div>
                      <div className={selected.risk === "critical" ? "text-red-400" : selected.risk === "warning" ? "text-amber-300" : "text-emerald-400"}>
                        {selected.risk === "critical" ? "Критично" : selected.risk === "warning" ? "Внимание" : "Штатно"}
                      </div>
                    </div>
                  </div>
                  {selected.debt && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <div className="text-sm"><span className="text-slate-300">Долг:</span> <span className="font-semibold text-red-300">{selected.debt}</span></div>
                    </div>
                  )}
                  <p className="text-xs leading-relaxed text-slate-400">{selected.note}</p>
                  <button
                    onClick={() => navigate({ to: "/registry" })}
                    className="group flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20"
                  >
                    В досье <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-500">Выберите маркер на карте для просмотра данных субъекта.</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
