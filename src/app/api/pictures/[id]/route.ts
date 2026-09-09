// app/api/pictures/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import sql from "@/app/lib/data";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Même validation que pour la création
    if (
      !target ||
      !target_category ||
      !publicID ||
      !capture_date ||
      !optics ||
      !camera
    ) {
      return NextResponse.json(
        { error: "Veuillez renseigner tous les champs obligatoires." },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE pictures SET
        title = ${title || null},
        target = ${target},
        target_category = ${target_category},
        publicid = ${publicID},
        annotated_publicid = ${annotatedPublicID || null},
        capture_date = ${capture_date},
        optics = ${optics},
        camera = ${camera},
        mount = ${mount || null},
        accessories = ${accessories || null},
        focal_length = ${focal_length !== null && focal_length !== undefined ? focal_length : null},
        f_number = ${f_number !== null && f_number !== undefined ? f_number : null},
        capture_data = ${sql.json(capture_data && capture_data.length > 0 ? capture_data : [])},
        processing_software = ${processing_software || processing_softwares || null},
        ra = ${ra !== null && ra !== undefined ? ra : null},
        dec = ${dec !== null && dec !== undefined ? dec : null},
        bortle_class = ${bortle_class !== null && bortle_class !== undefined ? bortle_class : null},
        location = ${location || null}
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Image introuvable." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Database update error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour en base de données." },
      { status: 500 }
    );
  }
}
