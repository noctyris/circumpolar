"use client";

import { getImageAction } from "@/app/lib/actions";
import { filter_t, Picture } from "@/types";
import RequiredField from "@/components/dashboard/RequiredField";
import { FormEvent, useEffect, useState } from "react";
import { Info, MapPin, Save, Telescope, Timer, Trash2 } from "lucide-react";
import UploadButton from "@/components/dashboard/UploadButton";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { useRouter } from "next/navigation";
import FormTabs from "@/components/dashboard/FormTabs";
import ListField from "@/components/dashboard/ListField";

type TabId = "general" | "equipment" | "acquisition" | "location";

function toDateInput(value?: string | null): string {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

const isTabId = (value: string | undefined): value is TabId =>
    value === "general" || value === "equipment" || value === "acquisition" || value === "location";

export default function ImagePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabId>("general");
    const [image, setImage] = useState<Picture>();
    const [loadError, setLoadError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [suggestions, setSuggestions] = useState<{
        optics: string[];
        camera: string[];
        mount: string[];
        accessories: string[];
        processing_softwares: string[];
        location: string[];
        filters: string[];
    }>({
        optics: [],
        camera: [],
        mount: [],
        accessories: [],
        processing_softwares: [],
        location: [],
        filters: [],
    });

    useEffect(() => {
        fetch("/api/pictures/suggestions")
            .then((res) => res.json())
            .then((data) => {
                if (!data.error) setSuggestions(data);
            })
            .catch(console.error);
    }, []);

    function updateImageProp<K extends keyof Picture>(key: K, value: Picture[K] | "") {
        setImage((prev) => {
            if (!prev) return prev;
            return { ...prev, [key]: value };
        });
    }

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            const { id } = await params;

            try {
                const result = await getImageAction(id);
                if (cancelled) return;

                if (!result) {
                    setLoadError("Capture introuvable.");
                    return;
                }

                setImage(result);
            } catch {
                if (!cancelled) setLoadError("Impossible de charger cette capture.");
            }
        };

        fetchData();
        return () => {
            cancelled = true;
        };
    }, [params]);

    const handleAnnotatedUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
        if (result?.info && typeof result.info === "object" && "public_id" in result.info) {
            updateImageProp("annotated_publicid", result.info.public_id);
        }
    };

    function showFirstInvalid(form: HTMLFormElement): boolean {
        const invalid = form.querySelector<HTMLElement>(":invalid");
        if (!invalid) return false;

        const tab = invalid.closest<HTMLElement>("[data-form-tab]")?.dataset.formTab;
        if (isTabId(tab)) setActiveTab(tab);
        requestAnimationFrame(() => form.reportValidity());

        return true;
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!image) return;

        if (showFirstInvalid(e.currentTarget)) return;

        setSaving(true);
        setError(null);

        const payload = {
            title: image.title,
            target: image.target,
            target_category: image.target_category,
            publicID: image.publicid,
            annotatedPublicID: image.annotated_publicid || null,
            capture_date: image.capture_date,
            optics: image.optics,
            camera: image.camera,
            mount: image.mount || null,
            accessories: image.accessories ?? null,
            focal_length: typeof image.focal_length === "number" ? image.focal_length : null,
            f_number: typeof image.f_number === "number" ? image.f_number : null,
            capture_data: (image.capture_data ?? [])
                .filter((row) => row.filter && Number(row.count) > 0)
                .map((row) => ({
                    filter: row.filter.trim(),
                    count: Number(row.count),
                    exposure: Number(row.exposure),
                })),
            processing_software: image.processing_software ?? null,
            ra: typeof image.ra === "number" ? image.ra : null,
            dec: typeof image.dec === "number" ? image.dec : null,
            bortle_class: typeof image.bortle_class === "number" ? image.bortle_class : null,
            location: image.location || null,
        };

        try {
            const res = await fetch(`/api/pictures/${image.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Erreur lors de la mise à jour");
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!image) return;
        if (!window.confirm("Supprimer définitivement cette image ? Cette action est irréversible.")) return;

        setSaving(true);
        setError(null);

        try {
            const res = await fetch(`/api/pictures/${image.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Erreur lors de la suppression");
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
        } finally {
            setSaving(false);
        }
    }

    function addCaptureRow() {
        setImage((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                capture_data: [...prev.capture_data, { filter: "", count: 0, exposure: 0 }],
            };
        });
    }

    function updateCaptureRow<K extends keyof filter_t>(index: number, field: K, value: filter_t[K]) {
        setImage((prev) => {
            if (!prev) return prev;
            const rows = [...prev.capture_data];
            rows[index] = { ...rows[index], [field]: value };
            return { ...prev, capture_data: rows };
        });
    }

    function removeCaptureRow(index: number) {
        setImage((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                capture_data: prev.capture_data.filter((_, i) => i !== index),
            };
        });
    }

    if (loadError) {
        return (
            <div className="mx-auto max-w-4xl px-4">
                <div role="alert" className="rounded border border-red-500 bg-red-500/10 p-3 text-red-400">
                    {loadError}
                </div>
            </div>
        );
    }

    if (!image) {
        return (
            <div className="mx-auto max-w-4xl space-y-4 px-4" role="status" aria-live="polite">
                <span className="sr-only">Chargement de la capture…</span>
                <div className="h-8 w-48 animate-pulse rounded bg-white/10" />
                <div className="h-12 animate-pulse rounded-xl bg-white/5" />
                <div className="h-64 animate-pulse rounded-xl bg-white/5" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4">
            <header className="mb-6 space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400">
                    Administration
                </p>
                <h1 className="text-2xl font-bold">Modifier la capture</h1>
                <p className="text-sm text-slate-400">
                    {image.title || image.target} · référence #{image.id}
                </p>
            </header>

            {error && (
                <div role="alert" className="mb-6 rounded border border-red-500 bg-red-500/10 p-3 text-red-400">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <FormTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={[
                        {
                            id: "general",
                            label: "Général",
                            icon: Info,
                            content: (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="edit-title" className="mb-1 block text-sm font-medium">
                                            Titre de la photo
                                        </label>
                                        <input
                                            id="edit-title"
                                            type="text"
                                            value={image.title ?? ""}
                                            onChange={(e) => updateImageProp("title", e.target.value)}
                                            className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="edit-target" className="mb-1 block text-sm font-medium">
                                            Nom technique<RequiredField />
                                        </label>
                                        <input
                                            id="edit-target"
                                            required
                                            type="text"
                                            value={image.target}
                                            onChange={(e) => updateImageProp("target", e.target.value)}
                                            className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="edit-category" className="mb-1 block text-sm font-medium">
                                            Catégorie<RequiredField />
                                        </label>
                                        <select
                                            id="edit-category"
                                            required
                                            value={image.target_category}
                                            onChange={(e) =>
                                                updateImageProp("target_category", e.target.value)
                                            }
                                            className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                                        >
                                            <option value="Ciel profond">Ciel profond</option>
                                            <option value="Lunaire">Lunaire</option>
                                            <option value="Solaire">Solaire</option>
                                            <option value="Planétaire">Planétaire</option>
                                            <option value="Système solaire">Système solaire</option>
                                            <option value="Open Field">Open Field</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="edit-date" className="mb-1 block text-sm font-medium">
                                            Date de capture<RequiredField />
                                        </label>
                                        <input
                                            id="edit-date"
                                            required
                                            type="date"
                                            value={toDateInput(image.capture_date)}
                                            onChange={(e) =>
                                                updateImageProp("capture_date", e.target.value)
                                            }
                                            className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <div id="edit-annotated-label" className="mb-1 block text-sm font-medium">
                                            PublicID Cloudinary (annoté)
                                        </div>
                                        <UploadButton
                                            resource={image.annotated_publicid || ""}
                                            setResource={(value: string) =>
                                                updateImageProp("annotated_publicid", value)
                                            }
                                            handler={handleAnnotatedUploadSuccess}
                                            label="Uploader la version annotée"
                                        />
                                    </div>
                                </div>
                            ),
                        },
                        {
                            id: "equipment",
                            label: "Matériel",
                            icon: Telescope,
                            content: (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="edit-optics" className="mb-1 block text-sm font-medium">
                                            Optique / Télescope<RequiredField />
                                        </label>
                                        <input
                                            id="edit-optics"
                                            required
                                            type="text"
                                            list="optics-list"
                                            value={image.optics}
                                            onChange={(e) => updateImageProp("optics", e.target.value)}
                                            className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                                        />
                                        <datalist id="optics-list">
                                            {suggestions.optics.map((item) => (
                                                <option key={item} value={item} />
                                            ))}
                                        </datalist>
                                    </div>
                                    <div>
                                        <label htmlFor="edit-camera" className="mb-1 block text-sm font-medium">
                                            Caméra / Capteur<RequiredField />
                                        </label>
                                        <input
                                            id="edit-camera"
                                            required
                                            type="text"
                                            list="camera-list"
                                            value={image.camera}
                                            onChange={(e) => updateImageProp("camera", e.target.value)}
                                            className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                                        />
                                        <datalist id="camera-list">
                                            {suggestions.camera.map((item) => (
                                                <option key={item} value={item} />
                                            ))}
                                        </datalist>
                                    </div>
                                    <div>
                                        <label htmlFor="edit-mount" className="mb-1 block text-sm font-medium">Monture</label>
                                        <input
                                            id="edit-mount"
                                            type="text"
                                            list="mount-list"
                                            value={image.mount ?? ""}
                                            onChange={(e) => updateImageProp("mount", e.target.value)}
                                            className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                                        />
                                        <datalist id="mount-list">
                                            {suggestions.mount.map((item) => (
                                                <option key={item} value={item} />
                                            ))}
                                        </datalist>
                                    </div>
                                    <div>
                                        <label htmlFor="edit-focal" className="mb-1 block text-sm font-medium">Focale (mm)</label>
                                        <input
                                            id="edit-focal"
                                            type="number"
                                            value={image.focal_length ?? ""}
                                            onChange={(e) =>
                                                updateImageProp(
                                                    "focal_length",
                                                    e.target.value === "" ? "" : Number(e.target.value)
                                                )
                                            }
                                            className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="edit-fnumber" className="mb-1 block text-sm font-medium">Rapport F/D</label>
                                        <input
                                            id="edit-fnumber"
                                            type="number"
                                            value={image.f_number ?? ""}
                                            onChange={(e) =>
                                                updateImageProp(
                                                    "f_number",
                                                    e.target.value === "" ? "" : Number(e.target.value)
                                                )
                                            }
                                            className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <ListField
                                            label="Accessoires"
                                            values={image.accessories ?? []}
                                            onChange={(values) => updateImageProp("accessories", values)}
                                            suggestions={suggestions.accessories}
                                            placeholder="Barlow 2×, réducteur…"
                                        />
                                    </div>
                                </div>
                            ),
                        },
                        {
                            id: "acquisition",
                            label: "Acquisition",
                            icon: Timer,
                            content: (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <p className="block text-sm font-medium">
                                            Poses<RequiredField />
                                        </p>
                                        {(image.capture_data ?? []).map((row, index) => (
                                            <div
                                                key={index}
                                                className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,1fr))_auto]"
                                            >
                                                <input
                                                    type="text"
                                                    list="filters-list"
                                                    placeholder="Filtre / Type"
                                                    aria-label={`Filtre de la pose ${index + 1}`}
                                                    value={row.filter}
                                                    onChange={(e) =>
                                                        updateCaptureRow(index, "filter", e.target.value)
                                                    }
                                                    className="rounded border border-slate-700 bg-slate-800 p-2"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Nombre"
                                                    aria-label={`Nombre de poses ${index + 1}`}
                                                    value={row.count || ""}
                                                    onChange={(e) =>
                                                        updateCaptureRow(index, "count", Number(e.target.value))
                                                    }
                                                    className="rounded border border-slate-700 bg-slate-800 p-2"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Exposition (s)"
                                                    aria-label={`Temps d'exposition de la pose ${index + 1}`}
                                                    value={row.exposure}
                                                    onChange={(e) =>
                                                        updateCaptureRow(index, "exposure", Number(e.target.value))
                                                    }
                                                    className="rounded border border-slate-700 bg-slate-800 p-2"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeCaptureRow(index)}
                                                    aria-label={`Supprimer la pose ${index + 1}`}
                                                    className="rounded bg-red-500/20 px-3 py-2 text-red-400 transition hover:bg-red-500/30"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        <datalist id="filters-list">
                                            {suggestions.filters.map((filter) => (
                                                <option key={filter} value={filter} />
                                            ))}
                                        </datalist>
                                        <button
                                            type="button"
                                            onClick={addCaptureRow}
                                            className="block pt-1 text-sm text-cyan-400 hover:underline"
                                        >
                                            + Ajouter une ligne de poses
                                        </button>
                                    </div>

                                    <ListField
                                        label="Logiciels de traitement"
                                        values={image.processing_software ?? []}
                                        onChange={(values) => updateImageProp("processing_software", values)}
                                        suggestions={suggestions.processing_softwares}
                                        placeholder="Siril, AutoStakkert!…"
                                    />
                                </div>
                            ),
                        },
                        {
                            id: "location",
                            label: "Localisation",
                            icon: MapPin,
                            content: (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <div className="md:col-span-2">
                                        <label htmlFor="edit-location" className="mb-1 block text-sm font-medium">Lieu</label>
                                        <input
                                            id="edit-location"
                                            type="text"
                                            list="location-list"
                                            value={image.location ?? ""}
                                            onChange={(e) => updateImageProp("location", e.target.value)}
                                            className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                                        />
                                        <datalist id="location-list">
                                            {suggestions.location.map((item) => (
                                                <option key={item} value={item} />
                                            ))}
                                        </datalist>
                                    </div>
                                    <div>
                                        <label htmlFor="edit-bortle" className="mb-1 block text-sm font-medium">
                                            Classe Bortle
                                        </label>
                                        <input
                                            id="edit-bortle"
                                            type="number"
                                            min={1}
                                            max={9}
                                            step={0.1}
                                            value={image.bortle_class ?? ""}
                                            onChange={(e) =>
                                                updateImageProp(
                                                    "bortle_class",
                                                    e.target.value === "" ? "" : Number(e.target.value)
                                                )
                                            }
                                            className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="edit-ra" className="mb-1 block text-sm font-medium">
                                            Ascension droite (°)
                                        </label>
                                        <input
                                            id="edit-ra"
                                            type="number"
                                            min={0}
                                            max={360}
                                            step="any"
                                            value={image.ra ?? ""}
                                            onChange={(e) =>
                                                updateImageProp(
                                                    "ra",
                                                    e.target.value === "" ? "" : Number(e.target.value)
                                                )
                                            }
                                            className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="edit-dec" className="mb-1 block text-sm font-medium">
                                            Déclinaison (°)
                                        </label>
                                        <input
                                            id="edit-dec"
                                            type="number"
                                            min={-90}
                                            max={90}
                                            step="any"
                                            value={image.dec ?? ""}
                                            onChange={(e) =>
                                                updateImageProp(
                                                    "dec",
                                                    e.target.value === "" ? "" : Number(e.target.value)
                                                )
                                            }
                                            className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                                        />
                                    </div>
                                </div>
                            ),
                        },
                    ]}
                />

                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-6 py-3 font-medium text-white transition hover:bg-cyan-500 disabled:opacity-50"
                >
                    <Save className="h-4 w-4" />
                    {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                </button>
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={saving}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/40 bg-transparent px-6 py-3 font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                >
                    <Trash2 className="h-4 w-4" />
                    Supprimer cette image
                </button>
            </form>
        </div>
    );
}
