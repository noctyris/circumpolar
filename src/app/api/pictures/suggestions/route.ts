// app/api/pictures/suggestions/route.ts
import { NextResponse } from "next/server";
import sql from "@/app/lib/data";

export async function GET() {
  try {
    const [
      opticsRows,
      cameraRows,
      mountRows,
      accessoriesRows,
      softwareRows,
      locationRows
    ] = await Promise.all([
      sql`SELECT DISTINCT optics FROM pictures WHERE optics IS NOT NULL AND optics != '' ORDER BY optics ASC`,
      sql`SELECT DISTINCT camera FROM pictures WHERE camera IS NOT NULL AND camera != '' ORDER BY camera ASC`,
      sql`SELECT DISTINCT mount FROM pictures WHERE mount IS NOT NULL AND mount != '' ORDER BY mount ASC`,
      sql`SELECT DISTINCT accessories FROM pictures WHERE accessories IS NOT NULL AND accessories != '' ORDER BY accessories ASC`,
      sql`SELECT DISTINCT processing_software FROM pictures WHERE processing_software IS NOT NULL AND processing_software != '' ORDER BY processing_software ASC`,
      sql`SELECT DISTINCT location FROM pictures WHERE location IS NOT NULL AND location != '' ORDER BY location ASC`,
    ]);

    return NextResponse.json({
      optics: opticsRows.map((r: any) => r.optics),
      camera: cameraRows.map((r: any) => r.camera),
      mount: mountRows.map((r: any) => r.mount),
      accessories: accessoriesRows.map((r: any) => r.accessories),
      processing_softwares: softwareRows.map((r: any) => r.processing_software),
      location: locationRows.map((r: any) => r.location),
    });
  } catch (error) {
    console.error("Erreur récupération suggestions:", error);
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 });
  }
}
