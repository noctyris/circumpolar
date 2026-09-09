"use client";

import { getImageAction } from "@/app/lib/actions";
import { filter_t, Picture } from "@/types";
import RequiredField from "@/components/dashboard/RequiredField";
import { FormEvent, useEffect, useState } from "react";
import { Send } from "lucide-react";
import UploadButton from "@/components/dashboard/UploadButton";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { useRouter } from "next/navigation";


export default function ImagePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [image, setImage] = useState<Picture>();
    const [error, setError] = useState<string|null>();
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<{ optics: string[];camera: string[];mount: string[];accessories: string[];processing_softwares: string[];location: string[];filters: string[]; }>({ optics: [],camera: [],mount: [],accessories: [],processing_softwares: [],location: [],filters: [],});

    useEffect(() => {
        fetch("/api/pictures/suggestions")
            .then((res) => res.json())
            .then((data) => {
                if (!data.error) setSuggestions(data);
            })
            .catch(console.error)
    }, []);

    function updateImageProp<K extends keyof Picture>(key: K, value: Picture[K]|"") {
        setImage((prev) => {
            if (!prev) return prev;
            return { ...prev, [key]: value };
        });
    }
    
    useEffect(() => {
        const fetchData = async () => {
            const { id } = await params;
            const images = await getImageAction(id);
            setImage(images);
        }
        fetchData();
    }, [])

    const handleAnnotatedUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
        if (result?.info && typeof result.info === "object" && "public_id" in result.info) {
            updateImageProp("annotated_publicid", result.info.public_id);
        }
    };

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!image) return;

        setLoading(true);
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
            accessories: image.accessories || null,
            focal_length: image.focal_length ?? null,
            f_number: image.f_number ?? null,
            capture_data: image.capture_data.filter((r) => r.filter && Number(r.count) > 0),
            processing_software: image.processing_software || null,
            ra: image.ra ?? null,
            dec: image.dec ?? null,
            bortle_class: image.bortle_class ?? null,
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
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
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
            return { ...prev, capture_data: prev.capture_data.filter((_, i) => i !== index) };
        });
    }
    
   return (
        <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-2xl font-bold mb-6">Modifier la capture</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-4">
                    <h2 className="text-lg font-semibold text-slate-200">Informations générales</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Titre de la photo</label>
                            <input type="text" value={image?.title} onChange={(e) => updateImageProp("title", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Nom technique<RequiredField /></label>
                            <input required type="text" value={image?.target} onChange={(e) => updateImageProp("target", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Catégorie<RequiredField /></label>
                            <select value={image?.target_category} onChange={(e) => updateImageProp("target_category", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2">
                                <option value={"Ciel profond"}>Ciel profond</option>
                                <option value={"Lunaire"}>Lunaire</option>
                                <option value={"Solaire"}>Solaire</option>
                                <option value={"Planétaire"}>Planétaire</option>
                                <option value={"Open Field"}>Open Field</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Date de capture<RequiredField /></label>
                            <input required type="date" value={image?.capture_date ? new Date(image.capture_date).toISOString().slice(0, 10) : ""} onChange={(e) => updateImageProp("capture_date", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">PublicID Cloudinary (annoté)</label>
                            <UploadButton
                                resource={image?.annotated_publicid || ""}
                                setResource={(value: string) => updateImageProp("annotated_publicid", value)}
                                handler={handleAnnotatedUploadSuccess}
                                label="Uploader la version annotée"
                            />
                        </div>
                    </div>
                </section>
                <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-4">
                    <h2 className="text-lg font-semibold text-slate-200">Matériel & Optique</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Optique / Télescope<RequiredField /></label>
                            <input required type="text" list="optics-list" value={image?.optics} onChange={(e) => updateImageProp("optics", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                            <datalist id="optics-list">
                                {suggestions.optics.map((item) => (
                                    <option key={item} value={item} />
                                ))}
                            </datalist>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Caméra / Capteur<RequiredField /></label>
                            <input required type="text" list="camera-list" value={image?.camera} onChange={(e) => updateImageProp("camera", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                            <datalist id="camera-list">
                                {suggestions.camera.map((item) => (
                                    <option key={item} value={item} />
                                ))}
                            </datalist>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Monture</label>
                            <input type="text" list="mount-list" value={image?.mount} onChange={(e) => updateImageProp("mount", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                            <datalist id="mount-list">
                                {suggestions.mount.map((item) => (
                                    <option key={item} value={item} />
                                ))}
                            </datalist>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Accessoires</label>
                            <input type="text" list="accessories-list" value={image?.accessories} onChange={(e) => updateImageProp("accessories", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                            <datalist id="accessories-list">
                                {suggestions.accessories.map((item) => (
                                    <option key={item} value={item} />
                                ))}
                            </datalist>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Focale (mm)</label>
                            <input type="number" value={image?.focal_length} onChange={(e) => updateImageProp("focal_length", e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Rapport F/D</label>
                            <input type="number" value={image?.f_number} onChange={(e) => updateImageProp("f_number", e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                        </div>
                    </div>
                </section>
                <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-4">
                    <h2 className="text-lg font-semibold text-slate-200">Données d'acquisition & Traitement</h2>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Poses<RequiredField /></label>
                        {image?.capture_data.map((row, index) => (
                            <div className="flex gap-2 items-center" key={index}>
                                <input type="text" list="filters-list" placeholder="Filtre / Type" value={row.filter} onChange={(e) => updateCaptureRow(index, "filter", e.target.value)} className="flex-1 bg-slate-800 border border-slate-700 rounded p-2" />
                                <input type="number" placeholder="Nombre" value={row.count || ""} onChange={(e) => updateCaptureRow(index, "count", Number(e.target.value))} className="flex-1 bg-slate-800 border border-slate-700 rounded p-2" />
                                <input type="number" placeholder="Temps d'exposition (s)" value={row.exposure} onChange={(e) => updateCaptureRow(index, "exposure", Number(e.target.value))} className="flex-1 bg-slate-800 border border-slate-700 rounded p-2" />
                                <button type="button" onClick={() => removeCaptureRow(index)} className="px-3 py-2 bg-red-500/2 text-red-400 hover:bg-red-500/30 rounded">×</button>
                            </div>
                        ))}
                        <datalist id="filters-list">
                            {suggestions.filters.map((f) => (
                                <option key={f} value={f} />
                            ))}
                        </datalist>
                        <button type="button" onClick={addCaptureRow} className="text-sm text-cyan-400 hover:underline pt-1 block"> + Ajouter une ligne de poses</button>
                    </div>
                    <div className="pt-2">
                        <label className="block text-sm font-medium mb-1">Logiciels de traitement</label>
                        <input type="text" list="processing-softwares-list" value={image?.processing_software} onChange={(e) => updateImageProp("processing_software", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2"/>
                        <datalist id="processing-softwares-list">
                            {suggestions.processing_softwares.map((item) => (
                                <option key={item} value={item} />
                            ))}
                        </datalist>
                    </div>
                </section>
                <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-4">
                    <h2 className="text-lg font-semibold text-slate-200">Localisation & Astrométrie</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Lieu</label>
                            <input type="text" list="location-list" value={image?.location} onChange={(e) => updateImageProp("location", e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2"/>
                            <datalist id="location-list">
                                {suggestions.location.map((item) => (
                                    <option key={item} value={item} />
                                ))}
                            </datalist>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Classe Bortle</label>
                            <input type="number" min={1} max={9} step={0.1} value={image?.bortle_class} onChange={(e) => updateImageProp("bortle_class", e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Ascension droite (°)</label>
                            <input type="number" min={0} max={360} step="any" value={image?.ra} onChange={(e) => updateImageProp("ra", e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Déclinaison (°)</label>
                            <input type="number" min={-90} max={90} step="any" value={image?.dec} onChange={(e) => updateImageProp("dec", e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                        </div>
                    </div>
                </section>
                <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium rounded-lg transition">{loading ? "Enregistrement..." : <><Send />Publier</>}</button>
            </form>
        </div>
    )

}
