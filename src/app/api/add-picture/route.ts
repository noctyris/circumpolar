// app/api/add-picture/route.ts
import { NextRequest, NextResponse } from "next/server";
import sql from "@/app/lib/data";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      title,
      target,
      target_category,
      publicID,
      annotatedPublicID,
      capture_date,
      optics,
      camera,
      mount,
      accessories,
      focal_length,
      f_number,
      capture_data,
      processing_software,
      processing_softwares,
      ra,
      dec,
      bortle_class,
      location,
    } = data;

    // Validation des champs NOT NULL requis par la base
    if (
      !target ||
      !target_category ||
      !publicID ||
      !capture_date ||
      !optics ||
      !camera ||
      !mount
    ) {
      return NextResponse.json(
        { error: "Veuillez renseigner tous les champs obligatoires." },
        { status: 400 }
      );
    }

    await sql`
      INSERT INTO pictures (
        title,
        target,
        target_category,
        publicid,
        annotated_publicid,
        capture_date,
        optics,
        camera,
        mount,
        accessories,
        focal_length,
        f_number,
        capture_data,
        processing_software,
        ra,
        dec,
        bortle_class,
        location
      )
      VALUES (
        ${title || null},
        ${target},
        ${target_category},
        ${publicID},
        ${annotatedPublicID || null},
        ${capture_date},
        ${optics},
        ${camera},
        ${mount},
        ${accessories || null},
        ${focal_length !== null && focal_length !== undefined ? focal_length : null},
        ${f_number !== null && f_number !== undefined ? f_number : null},
        ${sql.json(capture_data && capture_data.length > 0 ? capture_data : [])},
        ${processing_software || processing_softwares || null},
        ${ra !== null && ra !== undefined ? ra : null},
        ${dec !== null && dec !== undefined ? dec : null},
        ${bortle_class !== null && bortle_class !== undefined ? bortle_class : null},
        ${location || null}
      )
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Database insert error:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement en base de données." },
      { status: 500 }
    );
  }
}
