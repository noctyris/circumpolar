"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

interface CaptureRow {
    filter:     string;
    count:      number | "";
    exposure:   number | "";
}

function RequiredField() {
    return <span className="text-red-500">{" *"}</span>
}

export default function UploadPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Media
    const [publicId, setPublicId] = useState("");
    const [annotatedPublicId, setAnnotatedPublicId] = useState("");
    
    // Main informations
    const [title, setTitle] = useState("");
    const [target, setTarget] = useState("");
    const [targetCategory, setTargetCategory] = useState("Catégorie");
    const [captureDate, setCaptureDate] = useState("");
    
    // Hardware & Optics
    const [optics, setOptics] = useState("");
    const [camera, setCamera] = useState("");
    const [mount, setMount] = useState("");
    const [accessories, setAccessories] = useState("");
    const [focalLength, setFocalLength] = useState<number | "">("");
    const [fNumber, setFNumber] = useState<number | "">("");

    // Capture & Processing
    const [captureRows, setCaptureRows] = useState<CaptureRow[]>([]);
    const [processingSoftwares, setProcessingSoftwares] = useState("");

    // Coords & Sky
    const [ra, setRa] = useState<number | "">("");
    const [dec, setDec] = useState<number | "">("");
    const [bortleClass, setBortleClass] = useState<number | "">("");
    const [location, setLocation] = useState("");

    const addCaptureRow = () => {
        setCaptureRows([...captureRows, {filter: "", count: "", exposure: ""}])
    };

    const updateCaptureRow = (index: number, field: keyof CaptureRow, value: any) => {
        const updated = [...captureRows];
        updated[index] = { ...updated[index], [field]: value };
        setCaptureRows(updated);
    };

    const removeCaptureRow = (index: number) => {
        setCaptureRows(captureRows.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
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
            mount,
            accessories: accessories || null,
            focal_length: focalLength !== "" ? Number(focalLength) : null,
            f_number: fNumber !== "" ? Number(focalLength) : null,
            capture_data: captureRows.filter(r => r.filter && (Number(r.count !== "" ? r.count : 0) > 0)),
            processing_softwares: processingSoftwares || null,
            ra: ra !== "" ? Number(ra) : null,
            dec: dec !== "" ? Number(dec) : null,
            bortle_class: bortleClass !== "" ? Number(bortleClass) : null,
            location: location || null
        }
        try {
            const res = await fetch("/api/pictures", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Erreur lors de l'enregistrement");
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-2xl font-bold mb-6">Nouvelle capture</h1>

            {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-6">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-8">
                <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-4">
                    <h2 className="text-lg font-semibold text-slate-200">Informations générales</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Titre de la photo</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Nom technique<RequiredField /></label>
                            <input required type="text" value={target} onChange={(e) => setTarget(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Catégorie<RequiredField /></label>
                            <select value={targetCategory} onChange={(e) => setTargetCategory(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2">
                                <option value={"Ciel profond"}>Ciel profond</option>
                                <option value={"Lunaire"}>Lunaire</option>
                                <option value={"Solaire"}>Solaire</option>
                                <option value={"Planétaire"}>Planétaire</option>
                                <option value={"Open Field"}>Open Field</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Date de capture<RequiredField /></label>
                            <input required type="date" value={captureDate} onChange={(e) => setCaptureDate(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">PublicID Cloudinary<RequiredField /></label>
                            <input required type="text" value={publicId} onChange={(e) => setPublicId(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">PublicID Cloudinary (annoté)</label>
                            <input type="text" value={annotatedPublicId} onChange={(e) => setAnnotatedPublicId(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                        </div>
                    </div>
                </section>
                <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-4">
                    <h2 className="text-lg font-semibold text-slate-200">Matériel & Optique</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Optique / Télescope<RequiredField /></label>
                            <input required type="text" value={optics} onChange={(e) => setOptics(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Caméra / Capteur<RequiredField /></label>
                            <input required type="text" value={camera} onChange={(e) => setCamera(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Monture<RequiredField /></label>
                            <input required type="text" value={mount} onChange={(e) => setMount(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Accessoires</label>
                            <input type="text" value={accessories} onChange={(e) => setAccessories(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Focale (mm)</label>
                            <input type="number" value={focalLength} onChange={(e) => setFocalLength(e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Rapport F/D</label>
                            <input type="number" value={fNumber} onChange={(e) => setFNumber(e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                        </div>
                    </div>
                </section>
                <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-4">
                    <h2 className="text-lg font-semibold text-slate-200">Données d'acquisition & Traitement</h2>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Poses<RequiredField /></label>
                        {captureRows.map((row, index) => (
                            <div className="flex gap-2 items-center" key={index}>
                                <input type="text" placeholder="Filtre / Type" value={row.filter} onChange={(e) => updateCaptureRow(index, "filter", e.target.value)} className="flex-1 bg-slate-800 border border-slate-700 rounded p-2" />
                                <input type="number" placeholder="Nombre" value={row.count || ""} onChange={(e) => updateCaptureRow(index, "count", Number(e.target.value))} className="flex-1 bg-slate-800 border border-slate-700 rounded p-2" />
                                <input type="number" placeholder="Temps d'exposition (s)" value={row.exposure || ""} onChange={(e) => updateCaptureRow(index, "exposure", Number(e.target.value))} className="flex-1 bg-slate-800 border border-slate-700 rounded p-2" />
                                <button type="button" onClick={() => removeCaptureRow(index)} className="px-3 py-2 bg-red-500/2 text-red-400 hover:bg-red-500/30 rounded">×</button>
                            </div>
                        ))}
                        <button type="button" onClick={addCaptureRow} className="text-sm text-cyan-400 hover:underline pt-1 block"> + Ajouter une ligne de poses</button>
                    </div>
                    <div className="pt-2">
                        <label className="block text-sm font-medium mb-1">Logiciels de traitement</label>
                        <input type="text" value={processingSoftwares} onChange={(e) => setProcessingSoftwares(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2"/>
                    </div>
                </section>
                <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-4">
                    <h2 className="text-lg font-semibold text-slate-200">Localisation & Astrométrie</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Lieu</label>
                            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Classe Bortle</label>
                            <input type="number" min={1} max={9} step={0.1} value={bortleClass} onChange={(e) => setBortleClass(e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Ascension droite (°)</label>
                            <input type="number" min={0} max={360} step="any" value={ra} onChange={(e) => setRa(e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Déclinaison (°)</label>
                            <input type="number" min={-90} max={90} step="any" value={dec} onChange={(e) => setDec(e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                        </div>
                    </div>
                </section>
                <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-cyan-600 hover:bg-cyan-600 disabled:opacity-50 text-white font-medium rounded-lg transition">{loading ? "Enregistrement..." : <><Send />Publier</>}</button>
            </form>
        </div>
    )
}
