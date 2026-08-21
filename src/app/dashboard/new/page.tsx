"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/router";

interface CaptureRow {
    filter:     string;
    count:      number;
    exposure:   number;
}

function RequiredField() {
    return <span className="text-red-500">{" *"}</span>
}

export default function UploadPage() {
//    const router = useRouter();
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
    const [focalLength, setFocalLength] = useState<number>();
    const [fNumber, setFNumber] = useState<number>();

    // Capture & Processing
    const [captureRows, setCaptureRows] = useState<CaptureRow[]>([]);
    const [processingSoftwares, setProcessingSoftwares] = useState("");

    // Coords & Sky
    const [ra, setRa] = useState<number>();
    const [dec, setDec] = useState<number>();
    const [bortleClass, setBortleClass] = useState<number>();
    const [location, setLocation] = useState("");

    const addCaptureRow = () => {
        setCaptureRows([...captureRows, {filter: "", count: 0, exposure: 0}])
    };

    const updateCaptureRow = (index: number, field: keyof CaptureRow, value: any) => {
        const updated = [...captureRows];
        updated[index] = { ...updated[index], [field]: value };
        setCaptureRows(updated);
    };

    const removeCaptureRow = (index: number) => {
        setCaptureRows(captureRows.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {

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
                            <input required type="text" value={annotatedPublicId} onChange={(e) => setAnnotatedPublicId(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2" />
                        </div>
                    </div>
                </section>
            </form>
        </div>
    )
}
