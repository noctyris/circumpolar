"use client";

import { useId, useState } from "react";
import { Plus, X } from "lucide-react";

export default function ListField({
  label,
  values,
  onChange,
  suggestions,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  suggestions: string[];
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const listId = `${useId()}-list`;

  function addDraft() {
    const additions = draft
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (additions.length === 0) return;

    onChange(Array.from(new Set([...values, ...additions])));
    setDraft("");
  }

  return (
    <div className="space-y-2">
      <p className="block text-sm font-medium">{label}</p>

      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <span
              key={value}
              className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-200"
            >
              {value}
              <button
                type="button"
                onClick={() => onChange(values.filter((item) => item !== value))}
                aria-label={`Retirer ${value}`}
                className="rounded-full p-0.5 text-slate-400 transition hover:bg-slate-700 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          list={listId}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              addDraft();
            }
          }}
          placeholder={placeholder ?? "Ajouter une valeur"}
          aria-label={label}
          className="min-w-0 flex-1 rounded border border-slate-700 bg-slate-800 p-2"
        />
        <button
          type="button"
          onClick={addDraft}
          disabled={!draft.trim()}
          className="inline-flex items-center gap-1 rounded border border-slate-700 bg-slate-800 px-3 text-sm text-slate-200 transition hover:bg-slate-700 disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </button>
      </div>

      <datalist id={listId}>
        {suggestions.map((item) => (
          <option key={item} value={item} />
        ))}
      </datalist>

      <p className="text-xs text-slate-500">Entrée ou virgule pour ajouter plusieurs valeurs.</p>
    </div>
  );
}
