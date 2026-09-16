"use client";

import { useMemo, useState } from "react";
import {
  ArrowRightLeft,
  Bell,
  CheckCircle2,
  CircleAlert,
  Clock3,
  CreditCard,
  FileText,
  Filter,
  MapPinned,
  RefreshCcw,
  Search,
  ShieldCheck,
  TrendingUp,
  UserCircle2,
  Wallet,
  Zap,
} from "lucide-react";

const workflowCards = [
  {
    title: "New Connection",
    subtitle: "Open Interactive Map",
    tone: "blue",
    icon: Zap,
    count: 12,
    status: "In progress",
    steps: ["Pin consent location", "System check", "Eligibility review"],
  },
  {
    title: "Track Application",
    subtitle: "View Application Status",
    tone: "blue",
    icon: FileText,
    count: 8,
    status: "Monitoring",
    steps: ["Track status", "Receive notifications", "View timeline"],
  },
  {
    title: "Incident Report",
    subtitle: "Open Incident Module",
    tone: "orange",
    icon: CircleAlert,
    count: 3,
    status: "Action needed",
    steps: ["Report issue", "Admin review", "Notify service team"],
  },
  {
    title: "Bills & Payments",
    subtitle: "View Current Bill",
    tone: "green",
    icon: Wallet,
    count: 21,
    status: "Due this week",
    steps: ["Payment history", "Billing status", "Due reminders"],
  },
  {
    title: "Reconnection",
    subtitle: "View Outstanding Balance",
    tone: "red",
    icon: RefreshCcw,
    count: 5,
    status: "Requires review",
    steps: ["Reconnect request", "Validation", "Service restoration"],
  },
  {
    title: "Transfer Connection",
    subtitle: "View / Edit Profile",
    tone: "violet",
    icon: ArrowRightLeft,
    count: 4,
    status: "Pending approval",
    steps: ["Transfer request", "Eligibility check", "Final transfer"],
  },
  {
    title: "Profile",
    subtitle: "Manage Contact Info",
    tone: "slate",
    icon: UserCircle2,
    count: 27,
    status: "Active",
    steps: ["Edit profile", "Password reset", "Verification"],
  },
];

const summaryStats = [
  { label: "New Applications", value: "128", change: "+18%", tone: "blue" },
  { label: "Pending Review", value: "42", change: "+6%", tone: "amber" },
  { label: "Approved This Week", value: "91", change: "+12%", tone: "green" },
  { label: "Reconnect Requests", value: "19", change: "-3%", tone: "red" },
];

const applications = [
  {
    id: "APP-2026-0142",
    customer: "Maria Dela Cruz",
    type: "New Connection",
    barangay: "Barangay 12",
    status: "Under Review",
    priority: "High",
  },
  {
    id: "APP-2026-0138",
    customer: "Roberto Garcia",
    type: "Reconnection",
    barangay: "Barangay 5",
    status: "Waiting for Admin",
    priority: "Medium",
  },
  {
    id: "APP-2026-0129",
    customer: "Liza Santos",
    type: "Transfer Connection",
    barangay: "Barangay 9",
    status: "Approved",
    priority: "Low",
  },
  {
    id: "APP-2026-0115",
    customer: "Alvin Tan",
    type: "Bills & Payment",
    barangay: "Barangay 2",
    status: "Pending Payment",
    priority: "High",
  },
  {
    id: "APP-2026-0108",
    customer: "Cecilia Reyes",
    type: "Incident Report",
    barangay: "Barangay 7",
    status: "Investigating",
    priority: "Medium",
  },
];

const statusClasses: Record<string, string> = {
  "Under Review": "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  "Waiting for Admin": "bg-sky-100 text-sky-700 ring-1 ring-sky-200",
  Approved: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  "Pending Payment": "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
  Investigating: "bg-violet-100 text-violet-700 ring-1 ring-violet-200",
};

const priorityClasses: Record<string, string> = {
  High: "bg-rose-100 text-rose-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-emerald-100 text-emerald-700",
};

export default function AdminDashboard() {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filteredApplications = useMemo(() => {
    if (selectedFilter === "All") return applications;
    return applications.filter((item) => item.status === selectedFilter || item.type === selectedFilter);
  }, [selectedFilter]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto max-w-[1700px] p-6 lg:p-8">
        <header className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-300/40">
                <Zap className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">ZAMSURECO II</p>
                <h1 className="text-2xl font-black text-slate-900">Admin Operations Center</h1>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative min-w-[240px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none ring-0 transition focus:border-blue-400"
                  placeholder="Search application"
                />
              </div>
              <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
                <Filter className="h-4 w-4" />
                Filters
              </button>
              <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700">
                <Bell className="h-4 w-4" />
                Alerts
              </button>
            </div>
          </div>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-slate-500">{stat.label}</span>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                  stat.tone === "blue"
                    ? "bg-blue-100 text-blue-700"
                    : stat.tone === "amber"
                      ? "bg-amber-100 text-amber-700"
                      : stat.tone === "green"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-slate-900">{stat.value}</span>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    stat.tone === "blue"
                      ? "bg-blue-100 text-blue-700"
                      : stat.tone === "amber"
                        ? "bg-amber-100 text-amber-700"
                        : stat.tone === "green"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                  }`}
                >
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </section>

        <main className="space-y-8">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Workflow</p>
                <h2 className="text-xl font-bold text-slate-900">Consumer Lifecycle Modules</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
                {[
                  "All",
                  "Under Review",
                  "Waiting for Admin",
                  "Approved",
                  "Pending Payment",
                  "Investigating",
                ].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`rounded-full px-3 py-1.5 transition ${
                      selectedFilter === filter
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
              {workflowCards.map(({ title, subtitle, tone, icon: Icon, count, status, steps }) => (
                <article
                  key={title}
                  className={`rounded-2xl border p-4 shadow-sm ${
                    tone === "blue"
                      ? "border-blue-200 bg-blue-50/70"
                      : tone === "orange"
                        ? "border-amber-200 bg-amber-50/70"
                        : tone === "green"
                          ? "border-emerald-200 bg-emerald-50/70"
                          : tone === "red"
                            ? "border-rose-200 bg-rose-50/70"
                            : tone === "violet"
                              ? "border-violet-200 bg-violet-50/70"
                              : "border-slate-200 bg-slate-50/70"
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      tone === "blue"
                        ? "bg-blue-600 text-white"
                        : tone === "orange"
                          ? "bg-amber-500 text-white"
                          : tone === "green"
                            ? "bg-emerald-600 text-white"
                            : tone === "red"
                              ? "bg-rose-600 text-white"
                              : tone === "violet"
                                ? "bg-violet-600 text-white"
                                : "bg-slate-700 text-white"
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-white/80 px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                      {count}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{subtitle}</p>

                  <div className="mt-4 space-y-2">
                    {steps.map((step) => (
                      <div key={step} className="flex items-center gap-2 text-sm text-slate-700">
                        <span className="h-2 w-2 rounded-full bg-slate-400" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Status</span>
                    <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                      {status}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-8 xl:grid-cols-[1.8fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Queue</p>
                  <h2 className="text-xl font-bold text-slate-900">Service Requests</h2>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  <Clock3 className="h-4 w-4" />
                  Updated 8 minutes ago
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
                  <thead>
                    <tr className="text-slate-500">
                      <th className="px-3 py-2 font-semibold">Application ID</th>
                      <th className="px-3 py-2 font-semibold">Customer</th>
                      <th className="px-3 py-2 font-semibold">Type</th>
                      <th className="px-3 py-2 font-semibold">Location</th>
                      <th className="px-3 py-2 font-semibold">Priority</th>
                      <th className="px-3 py-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((application) => (
                      <tr key={application.id} className="rounded-2xl bg-slate-50 text-slate-700 shadow-sm">
                        <td className="rounded-l-2xl px-3 py-3 font-semibold text-slate-900">{application.id}</td>
                        <td className="px-3 py-3">{application.customer}</td>
                        <td className="px-3 py-3">{application.type}</td>
                        <td className="px-3 py-3">{application.barangay}</td>
                        <td className="px-3 py-3">
                          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${priorityClasses[application.priority]}`}>
                            {application.priority}
                          </span>
                        </td>
                        <td className="rounded-r-2xl px-3 py-3">
                          <span className={`rounded-full px-2.5 py-1.5 text-xs font-semibold ${statusClasses[application.status]}`}>
                            {application.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Dispatch</p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">Admin Checklist</h3>
                <div className="mt-5 space-y-4">
                  {[
                    { label: "Application requirements complete", done: true },
                    { label: "Customer documents verified", done: true },
                    { label: "Inspection schedule approved", done: false },
                    { label: "Payment instruction sent", done: false },
                  ].map((task) => (
                    <div key={task.label} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full ${task.done ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-600"}`}>
                        {task.done ? <CheckCircle2 className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
                      </div>
                      <span className="text-sm text-slate-700">{task.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Compliance</p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">Verification Center</h3>
                <div className="mt-5 space-y-4 text-sm text-slate-700">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                    <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Identity</span>
                    <span className="font-semibold text-emerald-700">Verified</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                    <span className="flex items-center gap-2"><MapPinned className="h-4 w-4 text-blue-600" /> Service location</span>
                    <span className="font-semibold text-blue-700">Checked</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                    <span className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-violet-600" /> Payment status</span>
                    <span className="font-semibold text-violet-700">Active</span>
                  </div>
                </div>
              </div>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
}
