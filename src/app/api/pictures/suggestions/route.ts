// app/api/pictures/suggestions/route.ts
import { NextResponse } from "next/server";
import { auth } from "@root/auth";
import sql from "@/app/lib/data";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      opticsRows,
      cameraRows,
      mountRows,
      accessoriesRows,
      softwareRows,
      locationRows,
      filterRows,
    ] = await Promise.all([
      sql`SELECT DISTINCT optics FROM pictures WHERE optics IS NOT NULL AND optics != '' ORDER BY optics ASC`,
      sql`SELECT DISTINCT camera FROM pictures WHERE camera IS NOT NULL AND camera != '' ORDER BY camera ASC`,
      sql`SELECT DISTINCT mount FROM pictures WHERE mount IS NOT NULL AND mount != '' ORDER BY mount ASC`,
      sql`SELECT DISTINCT accessories FROM pictures WHERE accessories IS NOT NULL AND accessories != '' ORDER BY accessories ASC`,
      sql`SELECT DISTINCT processing_software FROM pictures WHERE processing_software IS NOT NULL AND processing_software != '' ORDER BY processing_software ASC`,
      sql`SELECT DISTINCT location FROM pictures WHERE location IS NOT NULL AND location != '' ORDER BY location ASC`,
      sql`SELECT DISTINCT elem->>'filter' AS filter FROM pictures, jsonb_array_elements(capture_data) AS elem WHERE elem->>'filter' IS NOT NULL AND elem ->>'filter' != '' ORDER BY filter ASC`
    ]);

    const defaultFilters = [
      "Luminance (L)",
      "Red (R)",
      "Green (G)",
      "Blue (B)",
      "H-Alpha (Ha)",
      "OIII",
      "SII",
      "Dual Band",
      "Tri Band",
      "CLS",
      "UV/IR Cut",
      "Sans filtre (Clear)",
      "Solaire Solarix Explore Scientific",
    ];
    const dbFilters = filterRows.flatMap((row) =>
      typeof row.filter === "string" ? [row.filter] : []
    );
    const mergedFilters = Array.from(new Set([...dbFilters, ...defaultFilters])).sort();

    return NextResponse.json(
      {
        optics: opticsRows.map((r) => r.optics),
        camera: cameraRows.map((r) => r.camera),
        mount: mountRows.map((r) => r.mount),
        accessories: accessoriesRows.map((r) => r.accessories),
        processing_softwares: softwareRows.map((r) => r.processing_software),
        location: locationRows.map((r) => r.location),
        filters: mergedFilters,
      },
      // Données réservées au dashboard : jamais de cache partagé.
      { headers: { "Cache-Control": "private, max-age=60" } }
    );
  } catch (error) {
    console.error("Erreur récupération suggestions:", error);
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 });
  }
}
