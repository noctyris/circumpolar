"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type FormTab<T extends string> = {
  id: T;
  label: string;
  icon: LucideIcon;
  content: ReactNode;
};

export default function FormTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: FormTab<T>[];
  activeTab: T;
  onTabChange: (id: T) => void;
}) {
  return (
    <>
      <div
        role="tablist"
        aria-label="Sections du formulaire"
        className="flex gap-1 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 p-1"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={active}
              aria-controls={`panel-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 font-subtitle text-[10px] uppercase tracking-widest transition sm:px-4 ${
                active
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <section
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          data-form-tab={tab.id}
          hidden={activeTab !== tab.id}
          className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/50 p-6"
        >
          {tab.content}
        </section>
      ))}
    </>
  );
}
