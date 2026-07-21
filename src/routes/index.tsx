import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
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
  const [mapReady, setMapReady] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

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

      const tileUrl = isDark
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

      L.tileLayer(tileUrl, {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap &copy; CARTO",
      }).addTo(map);

      MARKERS.forEach((m) => {
        const icon = L.divIcon({
          className: "",
          html: `<div class="risk-marker ${RISK_COLOR[m.risk]}"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        const marker = L.marker([m.lat, m.lng], { icon }).addTo(map);
        marker.on("click", () => navigate({ to: "/registry" }));
        
        const tooltipHtml = `
          <div class="space-y-3 w-64 p-1">
            <div class="flex items-start gap-2">
              <span class="risk-marker ${RISK_COLOR[m.risk]} mt-1.5 h-3 w-3 inline-block rounded-full"></span>
              <div>
                <div class="text-sm font-semibold text-white">${m.name}</div>
                <div class="font-mono text-xs text-slate-400">БИН ${m.bin}</div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="rounded-md bg-white/5 p-2">
                <div class="text-slate-500">Район</div>
                <div class="text-slate-200">${m.district}</div>
              </div>
              <div class="rounded-md bg-white/5 p-2">
                <div class="text-slate-500">Уровень</div>
                <div class="${m.risk === "critical" ? "text-red-400" : m.risk === "warning" ? "text-amber-300" : "text-emerald-400"}">
                  ${m.risk === "critical" ? "Критично" : m.risk === "warning" ? "Внимание" : "Штатно"}
                </div>
              </div>
            </div>
            ${m.debt ? `
              <div class="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
                <div class="text-sm"><span class="text-slate-300">Долг:</span> <span class="font-semibold text-red-300">${m.debt}</span></div>
              </div>
            ` : ""}
            <p class="text-xs leading-relaxed text-slate-400">${m.note}</p>
            <div class="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-200">
              Нажмите, чтобы перейти в досье
            </div>
          </div>
        `;

        marker.bindTooltip(tooltipHtml, {
          direction: "top",
          offset: [0, -10],
          className: "!bg-slate-900/95 !backdrop-blur-xl !text-white !border !border-white/10 !rounded-xl !p-3 !shadow-2xl",
        });
      });

      setMapReady(true);
    })();
    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, [isDark]);

  return (
    <>
      <PageHeader
        title="Карта рисков"
        subtitle="Западно-Казахстанская область · оперативный мониторинг"
        right={
          <div className="relative w-[420px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
            <input
              placeholder="Поиск по названию ТОО или БИН..."
              className="w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-subtle focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        }
      />

      <div className="relative h-[calc(100vh-89px)] w-full">
        <div id="risk-map" className="absolute inset-0 cyber-grid" />

        {!mapReady && (
          <div className="absolute inset-0 grid place-items-center text-subtle text-sm">
            Загрузка карты...
          </div>
        )}

        {/* Right floating panel */}
        <div className="pointer-events-none absolute right-6 top-6 bottom-6 z-[400] w-[320px]">
          <div className="pointer-events-auto flex flex-col gap-4 overflow-hidden">
            {/* Filters */}
            <section className="rounded-xl border border-border bg-surface/80 p-4 backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/40">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">
                <Filter className="h-3.5 w-3.5" /> Фильтры
              </div>
              <div className="space-y-2">
                {([
                  ["taxes", "Налоги"],
                  ["salaries", "Зарплаты"],
                  ["courts", "Суды"],
                ] as const).map(([k, label]) => (
                  <label key={k} className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-sm text-body hover:bg-surface-2">
                    <input
                      type="checkbox"
                      checked={filters[k as keyof typeof filters]}
                      onChange={(e) => setFilters((f) => ({ ...f, [k]: e.target.checked }))}
                      className="h-4 w-4 accent-cyan-400"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
