"use client";

import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Info, MapPin, Send, Telescope, Timer } from "lucide-react";
import UploadButton from "@/components/dashboard/UploadButton";
import RequiredField from "@/components/dashboard/RequiredField";
import FormTabs from "@/components/dashboard/FormTabs";
import ListField from "@/components/dashboard/ListField";

interface CaptureRow {
    filter: string;
    count: number | "";
    exposure: number | "";
}

type TabId = "general" | "equipment" | "acquisition" | "location";

const isTabId = (value: string | undefined): value is TabId =>
    value === "general" || value === "equipment" || value === "acquisition" || value === "location";

const tabConfig = [
    { id: "general", label: "Général", icon: Info },
    { id: "equipment", label: "Matériel", icon: Telescope },
    { id: "acquisition", label: "Acquisition", icon: Timer },
    { id: "location", label: "Localisation", icon: MapPin },
] as const;

export default function UploadPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabId>("general");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Media
    const [publicId, setPublicId] = useState("");
    const [annotatedPublicId, setAnnotatedPublicId] = useState("");

    // Main informations
    const [title, setTitle] = useState("");
    const [target, setTarget] = useState("");
    const [targetCategory, setTargetCategory] = useState("");
    const [captureDate, setCaptureDate] = useState("");

    // Hardware & Optics
    const [optics, setOptics] = useState("");
    const [camera, setCamera] = useState("");
    const [mount, setMount] = useState("");
    const [accessories, setAccessories] = useState<string[]>([]);
    const [focalLength, setFocalLength] = useState<number | "">("");
    const [fNumber, setFNumber] = useState<number | "">("");

    // Capture & Processing
    const [captureRows, setCaptureRows] = useState<CaptureRow[]>([]);
    const [processingSoftwares, setProcessingSoftwares] = useState<string[]>([]);

    // Coords & Sky
    const [ra, setRa] = useState<number | "">("");
    const [dec, setDec] = useState<number | "">("");
    const [bortleClass, setBortleClass] = useState<number | "">("");
    const [location, setLocation] = useState("");

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

    const addCaptureRow = () => {
        setCaptureRows([...captureRows, { filter: "", count: "", exposure: "" }]);
    };

    const updateCaptureRow = (
        index: number,
        field: keyof CaptureRow,
        value: CaptureRow[keyof CaptureRow]
    ) => {
        const updated = [...captureRows];
        updated[index] = { ...updated[index], [field]: value };
        setCaptureRows(updated);
    };

    const removeCaptureRow = (index: number) => {
        setCaptureRows(captureRows.filter((_, i) => i !== index));
    };

    const handleMainUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
        if (result?.info && typeof result.info === "object" && "public_id" in result.info) {
            setPublicId(result.info.public_id);
        }
    };

    const handleAnnotatedUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
        if (result?.info && typeof result.info === "object" && "public_id" in result.info) {
            setAnnotatedPublicId(result.info.public_id);
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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (showFirstInvalid(form)) return;

        if (!publicId) {
            setError("Ajoute d'abord l'image principale.");
            setActiveTab("general");
            return;
        }

        setLoading(true);
        setError(null);

        const payload = {
            title,
            target,
            target_category: targetCategory,
            publicID: publicId,
            annotatedPublicID: annotatedPublicId || null,
            capture_date: captureDate,
            optics,
            camera,
            mount: mount || null,
            accessories: accessories.length > 0 ? accessories : null,
            focal_length: focalLength !== "" ? Number(focalLength) : null,
            f_number: fNumber !== "" ? Number(fNumber) : null,
            capture_data: captureRows
                .filter((row) => row.filter && Number(row.count) > 0)
                .map((row) => ({
                    filter: row.filter.trim(),
                    count: Number(row.count),
                    exposure: Number(row.exposure),
                })),
            processing_software: processingSoftwares.length > 0 ? processingSoftwares : null,
            ra: ra !== "" ? Number(ra) : null,
            dec: dec !== "" ? Number(dec) : null,
            bortle_class: bortleClass !== "" ? Number(bortleClass) : null,
            location: location || null,
        };

        try {
            const res = await fetch("/api/add-picture", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Erreur lors de l'enregistrement");
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors de l'enregistrement");
        } finally {
            setLoading(false);
        }
    };

    const [generalTab, equipmentTab, acquisitionTab, locationTab] = tabConfig;

    return (
        <div className="mx-auto max-w-4xl px-4">
            <header className="mb-6 space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400">
                    Administration
                </p>
                <h1 className="text-2xl font-bold">Nouvelle capture</h1>
                <p className="text-sm text-slate-400">
                    Les champs obligatoires sont marqués d’un astérisque. Tu peux passer d’un onglet à
                    l’autre sans perdre ce qui est déjà saisi.
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
                            ...generalTab,
                            content: (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="photo-title" className="mb-1 block text-sm font-medium">
                                            Titre de la photo
                                        </label>
                                        <input
                                            id="photo-title"
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="photo-target" className="mb-1 block text-sm font-medium">
                                            Nom technique<RequiredField />
                                        </label>
                                        <input
                                            id="photo-target"
                                            required
                                            type="text"
                                            value={target}
                                            onChange={(e) => setTarget(e.target.value)}
                                            className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="photo-category" className="mb-1 block text-sm font-medium">
                                            Catégorie<RequiredField />
                                        </label>
                                        <select
                                            id="photo-category"
                                            required
                                            value={targetCategory}
                                            onChange={(e) => setTargetCategory(e.target.value)}
                                            className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                                        >
                                            <option value="" disabled>
                                                Choisir une catégorie
                                            </option>
                                            <option value="Ciel profond">Ciel profond</option>
                                            <option value="Lunaire">Lunaire</option>
                                            <option value="Solaire">Solaire</option>
                                            <option value="Planétaire">Planétaire</option>
                                            <option value="Système solaire">Système solaire</option>
                                            <option value="Open Field">Open Field</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="photo-date" className="mb-1 block text-sm font-medium">
                                            Date de capture<RequiredField />
                                        </label>
                                        <input
                                            id="photo-date"
                                            required
                                            type="date"
                                            value={captureDate}
                                            onChange={(e) => setCaptureDate(e.target.value)}
                                            className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                                        />
                                    </div>
                                    <div>
                                        <div id="photo-image-label" className="mb-1 block text-sm font-medium">
                                            Image<RequiredField />
                                        </div>
                                        <UploadButton
                                            resource={publicId}
                                            setResource={setPublicId}
                                            handler={handleMainUploadSuccess}
                                            label="Uploader l'image principale"
                                        />
                                    </div>
                                    <div>
                                        <div id="photo-annotated-label" className="mb-1 block text-sm font-medium">
                                            PublicID Cloudinary (annoté)
                                        </div>
                                        <UploadButton
                                            resource={annotatedPublicId}
                                            setResource={setAnnotatedPublicId}
                                            handler={handleAnnotatedUploadSuccess}
                                            label="Uploader la version annotée"
                                        />
                                    </div>
                                </div>
                            ),
                        },
                        {
                            ...equipmentTab,
                            content: (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="photo-optics" className="mb-1 block text-sm font-medium">
                                            Optique / Télescope<RequiredField />
                                        </label>
                                        <input
                                            id="photo-optics"
                                            required
                                            type="text"
                                            list="optics-list"
                                            value={optics}
                                            onChange={(e) => setOptics(e.target.value)}
                                            className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                                        />
                                        <datalist id="optics-list">
                                            {suggestions.optics.map((item) => (
                                                <option key={item} value={item} />
                                            ))}
                                        </datalist>
                                    </div>
                                    <div>
                                        <label htmlFor="photo-camera" className="mb-1 block text-sm font-medium">
                                            Caméra / Capteur<RequiredField />
                                        </label>
                                        <input
                                            id="photo-camera"
                                            required
                                            type="text"
                                            list="camera-list"
                                            value={camera}
                                            onChange={(e) => setCamera(e.target.value)}
                                            className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                                        />
                                        <datalist id="camera-list">
                                            {suggestions.camera.map((item) => (
                                                <option key={item} value={item} />
                                            ))}
                                        </datalist>
                                    </div>
                                    <div>
                                        <label htmlFor="photo-mount" className="mb-1 block text-sm font-medium">Monture</label>
                                        <input
                                            id="photo-mount"
                                            type="text"
                                            list="mount-list"
                                            value={mount}
                                            onChange={(e) => setMount(e.target.value)}
                                            className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                                        />
                                        <datalist id="mount-list">
                                            {suggestions.mount.map((item) => (
                                                <option key={item} value={item} />
                                            ))}
                                        </datalist>
                                    </div>
                                    <div>
                                        <label htmlFor="photo-focal" className="mb-1 block text-sm font-medium">Focale (mm)</label>
                                        <input
                                            id="photo-focal"
                                            type="number"
                                            value={focalLength}
                                            onChange={(e) =>
                                                setFocalLength(e.target.value === "" ? "" : Number(e.target.value))
                                            }
                                            className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="photo-fnumber" className="mb-1 block text-sm font-medium">Rapport F/D</label>
                                        <input
                                            id="photo-fnumber"
                                            type="number"
                                            value={fNumber}
                                            onChange={(e) =>
                                                setFNumber(e.target.value === "" ? "" : Number(e.target.value))
                                            }
                                            className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <ListField
                                            label="Accessoires"
                                            values={accessories}
                                            onChange={setAccessories}
                                            suggestions={suggestions.accessories}
                                            placeholder="Barlow 2×, réducteur…"
                                        />
                                    </div>
                                </div>
                            ),
                        },
                        {
                            ...acquisitionTab,
                            content: (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <p className="block text-sm font-medium">
                                            Poses<RequiredField />
                                        </p>
                                        {captureRows.map((row, index) => (
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
                                        values={processingSoftwares}
                                        onChange={setProcessingSoftwares}
                                        suggestions={suggestions.processing_softwares}
                                        placeholder="Siril, AutoStakkert!…"
                                    />
                                </div>
                            ),
                        },
                        {
                            ...locationTab,
                            content: (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <div className="md:col-span-2">
                                        <label htmlFor="photo-location" className="mb-1 block text-sm font-medium">Lieu</label>
                                        <input
                                            id="photo-location"
                                            type="text"
                                            list="location-list"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                                        />
                                        <datalist id="location-list">
                                            {suggestions.location.map((item) => (
                                                <option key={item} value={item} />
                                            ))}
                                        </datalist>
                                    </div>
                                    <div>
                                        <label htmlFor="photo-bortle" className="mb-1 block text-sm font-medium">
                                            Classe Bortle
                                        </label>
                                        <input
                                            id="photo-bortle"
                                            type="number"
                                            min={1}
                                            max={9}
                                            step={0.1}
                                            value={bortleClass}
                                            onChange={(e) =>
                                                setBortleClass(e.target.value === "" ? "" : Number(e.target.value))
                                            }
                                            className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="photo-ra" className="mb-1 block text-sm font-medium">
                                            Ascension droite (°)
                                        </label>
                                        <input
                                            id="photo-ra"
                                            type="number"
                                            min={0}
                                            max={360}
                                            step="any"
                                            value={ra}
                                            onChange={(e) =>
                                                setRa(e.target.value === "" ? "" : Number(e.target.value))
                                            }
                                            className="w-full rounded border border-slate-700 bg-slate-800 p-2"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="photo-dec" className="mb-1 block text-sm font-medium">
                                            Déclinaison (°)
                                        </label>
                                        <input
                                            id="photo-dec"
                                            type="number"
                                            min={-90}
                                            max={90}
                                            step="any"
                                            value={dec}
                                            onChange={(e) =>
                                                setDec(e.target.value === "" ? "" : Number(e.target.value))
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
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-6 py-3 font-medium text-white transition hover:bg-cyan-500 disabled:opacity-50"
                >
                    {loading ? (
                        "Enregistrement..."
                    ) : (
                        <>
                            <Send className="h-4 w-4" />
                            Publier
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
