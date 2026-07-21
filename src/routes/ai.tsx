import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles,
  AlertTriangle,
  Database,
  FileSearch,
  ShieldAlert,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  ArrowRight,
  ArrowLeftRight,
  Search,
  Filter,
  Clock,
  Building2,
  GraduationCap,
  Banknote,
  Users,
  TrendingUp,
  Eye,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "ИИ-Аналитик — BatysMonitor" },
      { name: "description", content: "AI-анализ документов и обнаружение аномалий в данных ЗКО" },
    ],
  }),
  component: AiPage,
});

/* ── Types ── */
type Severity = "critical" | "warning" | "info";
type AnomalyStatus = "open" | "investigating" | "resolved";

type DataSource = {
  name: string;
  db: string;
  file?: string;
  table?: string;
  value: string | number;
  date: string;
};

type Anomaly = {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: AnomalyStatus;
  category: string;
  organization: string;
  bin: string;
  district: string;
  detectedAt: string;
  sourceA: DataSource;
  sourceB: DataSource;
  difference: string;
  aiComment: string;
  affectedAmount?: string;
};

/* ── Mock Data ── */
const ANOMALIES: Anomaly[] = [
  {
    id: "AN-001",
    title: "Расхождение количества студентов и получателей стипендии",
    description: "В базе МОН РК зарегистрировано 100 студентов, однако стипендия выплачивается на 200 человек по данным казначейства.",
    severity: "critical",
    status: "open",
    category: "Стипендии / Образование",
    organization: 'Колледж «Батыс Білім»',
    bin: "110240008811",
    district: "Уральск",
    detectedAt: "2026-07-02 14:32",
    sourceA: {
      name: "Реестр МОН РК",
      db: "mon_rk_students",
      file: "students_registry_2026_q2.xlsx",
      table: "active_students",
      value: 100,
      date: "2026-06-30",
    },
    sourceB: {
      name: "Казначейство РК",
      db: "treasury_payments",
      file: "stipend_payments_june2026.csv",
      table: "monthly_payments",
      value: 200,
      date: "2026-06-30",
    },
    difference: "+100 получателей (расхождение 100%)",
    aiComment: "Критическая аномалия: количество получателей стипендии в 2 раза превышает фактический контингент. Возможные причины: задвоение записей в реестре выплат, «мёртвые души», или ошибка миграции данных. Рекомендуется немедленная проверка.",
    affectedAmount: "14.2 млн ₸",
  },
  {
    id: "AN-002",
    title: "Несоответствие штатного расписания и фонда оплаты труда",
    description: "ФОТ начислен на 45 сотрудников, хотя штатное расписание утверждено на 32 ставки.",
    severity: "critical",
    status: "investigating",
    category: "Зарплаты / ФОТ",
    organization: 'ТОО «Орал Пром»',
    bin: "110240001235",
    district: "Уральск",
    detectedAt: "2026-07-01 09:15",
    sourceA: {
      name: "КГНС (налоговая)",
      db: "kgns_payroll",
      file: "form_200_2026_q2.xml",
      table: "payroll_declarations",
      value: 45,
      date: "2026-06-30",
    },
    sourceB: {
      name: "ЕНБЕК (биржа труда)",
      db: "enbek_staffing",
      file: "staffing_plan_oral_prom.pdf",
      table: "approved_positions",
      value: 32,
      date: "2026-06-15",
    },
    difference: "+13 сотрудников (расхождение 40.6%)",
    aiComment: "ФОТ превышает штатное расписание на 13 единиц. Возможно: совместители не отражены в штатном, подряды оформлены как ТД, или фиктивное трудоустройство. Требуется сверка трудовых договоров.",
    affectedAmount: "8.7 млн ₸",
  },
  {
    id: "AN-003",
    title: "Расхождение данных по земельному участку",
    description: "Площадь участка в кадастре и в договоре аренды отличается на 2.4 га.",
    severity: "warning",
    status: "open",
    category: "Земельные участки",
    organization: 'ТОО «Урал Агро»',
    bin: "210140005556",
    district: "Байтерек",
    detectedAt: "2026-06-30 16:45",
    sourceA: {
      name: "Госкадастр земель",
      db: "gzk_lands",
      file: "cadastre_extract_214.json",
      table: "land_parcels",
      value: "12.6 га",
      date: "2026-06-28",
    },
    sourceB: {
      name: "Договор аренды (акимат)",
      db: "akimat_contracts",
      file: "lease_contract_2024_0341.pdf",
      table: "active_leases",
      value: "15.0 га",
      date: "2024-03-15",
    },
    difference: "+2.4 га в договоре (расхождение 19%)",
    aiComment: "Площадь в договоре аренды превышает кадастровые данные. Вероятно: участок был частично изъят без обновления договора, либо допущена ошибка при регистрации. Рекомендуется выездная проверка.",
  },
  {
    id: "AN-004",
    title: "Дублирование контрагента в реестре поставщиков",
    description: "Один и тот же поставщик зарегистрирован дважды с разными БИН-ами, общая сумма госзакупок — 78 млн ₸.",
    severity: "warning",
    status: "investigating",
    category: "Госзакупки",
    organization: 'ТОО «СтройИнвест ЗКО» / ТОО «СтройИнвест-West»',
    bin: "190340002221 / 190340002255",
    district: "Акжаикский",
    detectedAt: "2026-06-29 11:20",
    sourceA: {
      name: "Портал госзакупок",
      db: "goszakup_registry",
      file: "suppliers_active_2026.csv",
      table: "registered_suppliers",
      value: "БИН 190340002221 — 45 млн ₸",
      date: "2026-06-28",
    },
    sourceB: {
      name: "Портал госзакупок",
      db: "goszakup_registry",
      file: "suppliers_active_2026.csv",
      table: "registered_suppliers",
      value: "БИН 190340002255 — 33 млн ₸",
      date: "2026-06-28",
    },
    difference: "2 записи, совпадение учредителей на 100%",
    aiComment: "Обнаружено совпадение учредителей, юридического адреса и контактных данных. Вероятно аффилированные компании, используемые для обхода порогов госзакупок. Совокупный объём: 78 млн ₸.",
    affectedAmount: "78 млн ₸",
  },
  {
    id: "AN-005",
    title: "Превышение лимита бюджетного финансирования",
    description: "Фактические расходы по программе «Дорожная карта занятости» на 22% превышают утверждённый план.",
    severity: "warning",
    status: "open",
    category: "Бюджет",
    organization: "Акимат ЗКО (Управление занятости)",
    bin: "000140000111",
    district: "Уральск",
    detectedAt: "2026-06-28 08:00",
    sourceA: {
      name: "Бюджетный план (МФРК)",
      db: "mf_budget_plans",
      file: "budget_plan_2026_employment.xlsx",
      table: "approved_limits",
      value: "120 млн ₸",
      date: "2026-01-15",
    },
    sourceB: {
      name: "Казначейство РК (факт)",
      db: "treasury_payments",
      file: "fact_payments_h1_2026.csv",
      table: "program_expenditures",
      value: "146.4 млн ₸",
      date: "2026-06-30",
    },
    difference: "+26.4 млн ₸ (превышение 22%)",
    aiComment: "Фактические выплаты превышают утверждённый лимит. Возможно наличие незаконных авансов или оплат по незавершённым работам. Рекомендуется аудит каждого транша.",
    affectedAmount: "26.4 млн ₸",
  },
  {
    id: "AN-006",
    title: "Несоответствие налоговых деклараций и банковских оборотов",
    description: "Декларированный доход в 3 раза ниже банковских поступлений за тот же период.",
    severity: "critical",
    status: "open",
    category: "Налоги / КПН",
    organization: 'ТОО «Аксай Нефть Сервис»',
    bin: "150840009877",
    district: "Бурлинский (Аксай)",
    detectedAt: "2026-07-02 10:05",
    sourceA: {
      name: "КГД (налоговая декларация)",
      db: "kgd_declarations",
      file: "kpn_declaration_q2_2026.xml",
      table: "income_declarations",
      value: "52 млн ₸",
      date: "2026-06-30",
    },
    sourceB: {
      name: "Нацбанк РК (банк. обороты)",
      db: "nbk_bank_turnover",
      file: "bank_turnover_aksay_neft.csv",
      table: "credit_turnover",
      value: "168 млн ₸",
      date: "2026-06-30",
    },
    difference: "+116 млн ₸ (расхождение 223%)",
    aiComment: "Банковские поступления кратно превышают декларированный доход. Высокая вероятность занижения налоговой базы. Рекомендуется выездная налоговая проверка и запрос выписок по всем счетам.",
    affectedAmount: "116 млн ₸",
  },
];

/* ── Helpers ── */
const SEVERITY_CONFIG: Record<Severity, { label: string; bg: string; text: string; border: string; dot: string }> = {
  critical: { label: "Критично", bg: "bg-red-500/10", text: "text-red-500 dark:text-red-400", border: "border-red-500/30", dot: "bg-red-500" },
  warning: { label: "Внимание", bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-300", border: "border-amber-500/30", dot: "bg-amber-500" },
  info: { label: "Информация", bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/30", dot: "bg-blue-500" },
};

const STATUS_CONFIG: Record<AnomalyStatus, { label: string; bg: string; text: string }> = {
  open: { label: "Открыто", bg: "bg-red-500/10", text: "text-red-500 dark:text-red-400" },
  investigating: { label: "На проверке", bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-300" },
  resolved: { label: "Решено", bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
};

const CATEGORY_ICONS: Record<string, typeof Sparkles> = {
  "Стипендии / Образование": GraduationCap,
  "Зарплаты / ФОТ": Users,
  "Земельные участки": Building2,
  "Госзакупки": Banknote,
  "Бюджет": TrendingUp,
  "Налоги / КПН": FileSearch,
};

/* ── KPI Card ── */
function KpiCard({ icon: Icon, label, value, accent, subtext }: {
  icon: typeof Sparkles; label: string; value: string | number; accent: string; subtext?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-subtle">{label}</span>
        <div className={`rounded-lg p-2 ${accent}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 text-2xl font-semibold text-heading">{value}</div>
      {subtext && <div className="mt-1 text-xs text-subtle">{subtext}</div>}
    </div>
  );
}

/* ── Source Card ── */
function SourceBlock({ source, label, accentBorder }: { source: DataSource; label: string; accentBorder: string }) {
  return (
    <div className={`flex-1 rounded-lg border ${accentBorder} bg-surface p-4 min-w-0`}>
      <div className="flex items-center gap-2 mb-3">
        <Database className="h-3.5 w-3.5 text-subtle shrink-0" />
        <span className="text-xs font-semibold uppercase tracking-wider text-subtle">{label}</span>
      </div>
      <div className="space-y-2.5">
        <div>
          <div className="text-[11px] text-subtle">Источник</div>
          <div className="text-sm font-medium text-heading">{source.name}</div>
        </div>
        <div>
          <div className="text-[11px] text-subtle">База данных</div>
          <div className="text-sm font-mono text-body">{source.db}</div>
        </div>
        {source.file && (
          <div>
            <div className="text-[11px] text-subtle">Файл / Документ</div>
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="text-sm font-mono text-primary truncate">{source.file}</span>
            </div>
          </div>
        )}
        {source.table && (
          <div>
            <div className="text-[11px] text-subtle">Таблица</div>
            <div className="text-sm font-mono text-body">{source.table}</div>
          </div>
        )}
        <div className="pt-2 border-t border-border-subtle">
          <div className="text-[11px] text-subtle">Значение</div>
          <div className="text-lg font-bold text-heading">{String(source.value)}</div>
          <div className="text-[11px] text-subtle mt-0.5">на {source.date}</div>
        </div>
      </div>
    </div>
  );
}

/* ── Anomaly Card (Expandable) ── */
function AnomalyCard({ anomaly }: { anomaly: Anomaly }) {
  const [expanded, setExpanded] = useState(false);
  const sev = SEVERITY_CONFIG[anomaly.severity];
  const stat = STATUS_CONFIG[anomaly.status];
  const CategoryIcon = CATEGORY_ICONS[anomaly.category] || FileSearch;

  return (
    <div className={`rounded-xl border ${sev.border} bg-surface overflow-hidden transition-shadow hover:shadow-lg dark:hover:shadow-black/20`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-6 py-5 flex items-start gap-4 cursor-pointer"
      >
        {/* Severity dot */}
        <div className="pt-1 shrink-0">
          <div className={`h-3 w-3 rounded-full ${sev.dot} shadow-[0_0_8px_currentColor]`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${sev.bg} ${sev.text}`}>
              <AlertTriangle className="h-3 w-3" />
              {sev.label}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${stat.bg} ${stat.text}`}>
              {stat.label}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-subtle">
              <CategoryIcon className="h-3 w-3" />
              {anomaly.category}
            </span>
            <span className="text-[11px] text-subtle font-mono">{anomaly.id}</span>
          </div>
          <h3 className="text-base font-semibold text-heading leading-snug">{anomaly.title}</h3>
          <p className="mt-1 text-sm text-body line-clamp-2">{anomaly.description}</p>
          <div className="mt-2 flex items-center gap-4 text-xs text-subtle">
            <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{anomaly.organization}</span>
            <span className="font-mono">БИН {anomaly.bin}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{anomaly.detectedAt}</span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          {anomaly.affectedAmount && (
            <div className={`rounded-lg px-3 py-1.5 text-sm font-bold ${sev.bg} ${sev.text}`}>
              {anomaly.affectedAmount}
            </div>
          )}
          <div className="text-subtle">
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-border-subtle px-6 pb-6 pt-5 space-y-5">
          {/* Source comparison */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-subtle mb-3 flex items-center gap-2">
              <ArrowLeftRight className="h-3.5 w-3.5" />
              Сравнение источников данных
            </h4>
            <div className="flex gap-4 items-stretch">
              <SourceBlock source={anomaly.sourceA} label="Источник A" accentBorder="border-cyan-500/30 dark:border-cyan-500/20" />
              
              {/* VS divider */}
              <div className="flex flex-col items-center justify-center gap-2 shrink-0 px-2">
                <div className="h-full w-px bg-border-subtle" />
                <div className={`rounded-full p-2 ${sev.bg} ${sev.text}`}>
                  <ArrowLeftRight className="h-4 w-4" />
                </div>
                <div className="h-full w-px bg-border-subtle" />
              </div>
              
              <SourceBlock source={anomaly.sourceB} label="Источник B" accentBorder={`${sev.border}`} />
            </div>
          </div>

          {/* Difference highlight */}
          <div className={`rounded-lg ${sev.bg} border ${sev.border} p-4`}>
            <div className="flex items-start gap-3">
              <ShieldAlert className={`h-5 w-5 shrink-0 mt-0.5 ${sev.text}`} />
              <div>
                <div className="text-sm font-semibold text-heading">Обнаруженная разница</div>
                <div className={`text-lg font-bold mt-1 ${sev.text}`}>{anomaly.difference}</div>
              </div>
            </div>
          </div>

          {/* AI Comment */}
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Вывод ИИ-аналитика</div>
                <p className="text-sm text-body leading-relaxed">{anomaly.aiComment}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
              <Eye className="h-4 w-4" />
              Открыть расследование
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-body hover:bg-surface-2 transition-colors">
              <ExternalLink className="h-4 w-4" />
              Скачать отчёт
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-body hover:bg-surface-2 transition-colors">
              <CheckCircle2 className="h-4 w-4" />
              Отклонить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Page ── */
function AiPage() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AnomalyStatus | "all">("all");

  const filtered = ANOMALIES.filter((a) => {
    const matchSearch = search === "" || [a.title, a.organization, a.bin, a.id, a.category]
      .some(v => v.toLowerCase().includes(search.toLowerCase()));
    const matchSeverity = severityFilter === "all" || a.severity === severityFilter;
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchSeverity && matchStatus;
  });

  const totalAmount = ANOMALIES
    .filter(a => a.affectedAmount)
    .reduce((sum, a) => sum + parseFloat(a.affectedAmount!.replace(/[^\d.]/g, "")), 0);

  return (
    <>
      <PageHeader
        title="ИИ-Аналитик"
        subtitle="Автоматический разбор документов и обнаружение аномалий"
        right={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Анализ активен</span>
            </div>
          </div>
        }
      />

      <div className="p-8 space-y-6">
        {/* KPI strip */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <KpiCard
            icon={AlertTriangle}
            label="Аномалий обнаружено"
            value={ANOMALIES.length}
            accent="bg-red-500/10 text-red-500 dark:text-red-400"
            subtext={`${ANOMALIES.filter(a => a.severity === "critical").length} критических`}
          />
          <KpiCard
            icon={Database}
            label="Источников проверено"
            value={8}
            accent="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
            subtext="КГД, МОН, Казначейство, ЕНБЕК и др."
          />
          <KpiCard
            icon={Banknote}
            label="Сумма расхождений"
            value={`${totalAmount.toFixed(1)} млн ₸`}
            accent="bg-amber-500/10 text-amber-600 dark:text-amber-300"
            subtext="за 1-е полугодие 2026"
          />
          <KpiCard
            icon={FileSearch}
            label="Документов обработано"
            value="1 247"
            accent="bg-violet-500/10 text-violet-600 dark:text-violet-400"
            subtext="XML, CSV, PDF, JSON"
          />
        </div>

        {/* Filters & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по аномалиям, организации или БИН..."
              className="w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-subtle focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-subtle" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as Severity | "all")}
              className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-body focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Все уровни</option>
              <option value="critical">Критично</option>
              <option value="warning">Внимание</option>
              <option value="info">Информация</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AnomalyStatus | "all")}
              className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-body focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Все статусы</option>
              <option value="open">Открыто</option>
              <option value="investigating">На проверке</option>
              <option value="resolved">Решено</option>
            </select>
          </div>

          <div className="ml-auto text-sm text-subtle">
            Показано {filtered.length} из {ANOMALIES.length} аномалий
          </div>
        </div>

        {/* Anomaly List */}
        <div className="space-y-4">
          {filtered.map((anomaly) => (
            <AnomalyCard key={anomaly.id} anomaly={anomaly} />
          ))}
          {filtered.length === 0 && (
            <div className="rounded-xl border border-border bg-surface p-16 text-center">
              <Search className="mx-auto h-10 w-10 text-subtle" />
              <p className="mt-4 text-sm text-subtle">Аномалий по заданным фильтрам не найдено</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
