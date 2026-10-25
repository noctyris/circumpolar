import { CldUploadButton, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { CheckCircle2, Upload, X } from "lucide-react";
import { useSyncExternalStore } from "react";

const MAX_UPLOAD_BYTES = Number(
    process.env.NEXT_PUBLIC_CLOUDINARY_MAX_UPLOAD_BYTES ?? 10_000_000
);

export default function UploadButton({
    resource,
    setResource,
    handler,
    label = "Uploader l'image"
}: {
    resource: string;
    setResource: (id: string) => void;
    handler: (result: CloudinaryUploadWidgetResults) => void;
    label?: string;
}) {
    // Détection d'hydratation sans setState dans un effet (rendu serveur =
    // false, rendu client = true).
    const mounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false,
    );

    if (resource) {
        return (
            <div className="flex items-center justify-between p-3 bg-slate-800/80 border border-emerald-500/40 rounded-lg">
                <div className="flex items-center gap-2 truncate">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-xs text-slate-300 truncate font-mono">{resource}</span>
                </div>
                <button
                    type="button"
                    onClick={() => setResource("")}
                    className="text-slate-400 hover:text-red-400 p-1"
                    title="Supprimer l'image"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    }

    // Placeholder pendant le rendu SSR initial pour éviter le conflit d'attributs
    if (!mounted) {
        return (
            <div className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 border border-dashed border-slate-600 rounded-lg text-sm text-slate-400 opacity-60">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>{label}</span>
            </div>
        );
    }

    return (
        <CldUploadButton
            options={{
                multiple: false,
                sources: ["local"],
                clientAllowedFormats: ["webp", "png", "jpg", "jpeg"],
                // Limite du plan Cloudinary : le fichier est refusé par le
                // widget au lieu d'échouer après envoi.
                maxFileSize: MAX_UPLOAD_BYTES,
                showPoweredBy: false,
                styles: {
                    palette: {
                        window: "#0f172a",
                        sourceBg: "#020617",
                        windowBorder: "#1e293b",
                        tabIcon: "#0891b2",
                        inactiveTabIcon: "#64748b",
                        menuIcons: "#94a3b8",
                        link: "#06b6d4",
                        action: "#0891b2",
                        inProgress: "#0284c7",
                        complete: "#10b981",
                        error: "#ef4444",
                        textDark: "#000000",
                        textLight: "#f8fafc"
                    }
                }
            }}
            onUploadAdded={(_, { widget }) => {
                widget.minimize();
            }}
            signatureEndpoint="/api/sign-cloudinary-params"
            onSuccess={(result, { widget }) => {
                handler(result);
                widget.close();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-dashed border-slate-600 rounded-lg text-sm text-slate-200 transition"
        >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>{label}</span>
        </CldUploadButton>
    );
}
