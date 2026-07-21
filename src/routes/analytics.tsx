import { createFileRoute } from "@tanstack/react-router";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { PageHeader } from "../components/PageHeader";
import { TrendingUp, TrendingDown, AlertOctagon } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Аналитика и Тренды — BatysMonitor" },
      { name: "description", content: "Тренды экономических показателей ЗКО" },
    ],
  }),
  component: AnalyticsPage,
});

const taxData = [
  { m: "Янв", kpn: 120, nds: 85 },
  { m: "Фев", kpn: 132, nds: 90 },
  { m: "Мар", kpn: 145, nds: 98 },
  { m: "Апр", kpn: 138, nds: 110 },
  { m: "Май", kpn: 165, nds: 122 },
  { m: "Июн", kpn: 188, nds: 140 },
];

const unemploymentData = [
  { m: "Янв", v: 4.8 },
  { m: "Фев", v: 4.9 },
  { m: "Мар", v: 5.1 },
  { m: "Апр", v: 5.3 },
  { m: "Май", v: 5.6 },
  { m: "Июн", v: 5.9 },
];

const districtData = [
  { name: "г. Уральск", value: 45, color: "#ef4444" },
  { name: "Бурлинский", value: 25, color: "#f59e0b" },
  { name: "Байтерек", value: 20, color: "#06b6d4" },
  { name: "Акжаикский", value: 10, color: "#10b981" },
];

const axis = { stroke: "#475569", fontSize: 12 };

function useIsDark() {
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

function KpiCard({ icon: Icon, label, value, trend, accent }: any) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-subtle">{label}</span>
        <Icon className={`h-4 w-4 ${accent}`} />
      </div>
      <div className="mt-3 text-2xl font-semibold text-heading">{value}</div>
      <div className={`mt-1 text-xs ${accent}`}>{trend}</div>
    </div>
  );
}

function AnalyticsPage() {
  const isDark = useIsDark();

  const tooltipStyle = {
    backgroundColor: isDark ? "#0f172a" : "#ffffff",
    border: isDark ? "1px solid rgba(148,163,184,0.2)" : "1px solid rgba(0,0,0,0.1)",
    borderRadius: 8,
    color: isDark ? "#e2e8f0" : "#1e293b",
    boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.1)",
  };

  const gridColor = isDark ? "rgba(148,163,184,0.1)" : "rgba(0,0,0,0.08)";
  const cursorFill = isDark ? "rgba(148,163,184,0.05)" : "rgba(0,0,0,0.04)";

  return (
    <>
      <PageHeader
        title="Аналитика и Тренды"
        subtitle="Сводные показатели экономических рисков · 1-е полугодие 2026"
      />
      <div className="p-8 space-y-6">
        {/* KPI strip */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <KpiCard icon={TrendingUp} label="Совокупная задолженность" value="328 млн ₸" trend="▲ 14.2% к маю" accent="text-red-400" />
          <KpiCard icon={AlertOctagon} label="Критических субъектов" value="47" trend="▲ 5 за неделю" accent="text-amber-300" />
          <KpiCard icon={TrendingDown} label="Уровень безработицы" value="5.9%" trend="▲ 0.3 п.п." accent="text-red-400" />
          <KpiCard icon={TrendingUp} label="Аудитов проведено" value="128" trend="▲ 22% к Q1" accent="text-emerald-400" />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Bar */}
          <section className="rounded-xl border border-border bg-surface p-5 xl:col-span-2">
            <header className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-heading">Динамика налоговой задолженности</h2>
                <p className="text-xs text-subtle">Млн ₸ · КПН и НДС по месяцам</p>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-cyan-400" /> КПН</span>
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-violet-400" /> НДС</span>
              </div>
            </header>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={taxData}>
                  <CartesianGrid stroke={gridColor} vertical={false} />
                  <XAxis dataKey="m" {...axis} />
                  <YAxis {...axis} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: cursorFill }} />
                  <Bar dataKey="kpn" name="КПН" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="nds" name="НДС" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Line */}
          <section className="rounded-xl border border-border bg-surface p-5">
            <header className="mb-4">
              <h2 className="text-base font-semibold text-heading">Уровень безработицы</h2>
              <p className="text-xs text-subtle">% от трудоспособного населения · 6 месяцев</p>
            </header>
            <div className="h-64">
              <ResponsiveContainer>
                <LineChart data={unemploymentData}>
                  <CartesianGrid stroke={gridColor} vertical={false} />
                  <XAxis dataKey="m" {...axis} />
                  <YAxis {...axis} domain={[4, 7]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="v"
                    name="Безработица, %"
                    stroke="#f87171"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#f87171", strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Pie */}
          <section className="rounded-xl border border-border bg-surface p-5">
            <header className="mb-4">
              <h2 className="text-base font-semibold text-heading">Концентрация рисков по районам</h2>
              <p className="text-xs text-subtle">Распределение критических субъектов</p>
            </header>
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={districtData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                    stroke={isDark ? "rgba(15,23,42,1)" : "rgba(255,255,255,1)"}
                  >
                    {districtData.map((d) => <Cell key={d.name} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => `${v}%`} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(v) => <span className="text-xs text-body">{v}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
