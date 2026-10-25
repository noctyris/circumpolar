// app/api/pictures/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@root/auth";
import sql from "@/app/lib/data";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function requireSession() {
  const session = await auth();
  return Boolean(session?.user);
}

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = parseId((await params).id);
    if (id === null) {
      return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
    }
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
        mount = ${mount || ""},
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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = parseId((await params).id);
    if (id === null) {
      return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
    }

    const deleted = await sql`
      DELETE FROM pictures WHERE id = ${id}
      RETURNING publicid, annotated_publicid
    `;

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Image introuvable." }, { status: 404 });
    }

    // Ménage côté Cloudinary : un asset déjà absent ne doit pas faire échouer
    // la requête.
    const publicIds = [
      deleted[0].publicid,
      deleted[0].annotated_publicid,
    ].filter((pid): pid is string => typeof pid === "string" && pid.length > 0);

    const results = await Promise.allSettled(
      publicIds.map((publicId) => cloudinary.uploader.destroy(publicId))
    );
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `Échec de la suppression Cloudinary (${publicIds[index]}):`,
          result.reason
        );
      }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Database delete error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la suppression." },
      { status: 500 }
    );
  }
}
