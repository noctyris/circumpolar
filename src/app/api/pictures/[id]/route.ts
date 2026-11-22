// app/api/pictures/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@root/auth";
import sql from "@/app/lib/data";
import { prepareListForDb } from "@/app/lib/list-columns";
import { readPictureRequest } from "@/app/lib/picture-request";

const cloudinaryApiKey =
  process.env.CLOUDINARY_API_KEY ?? process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: cloudinaryApiKey,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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

    const payload = await readPictureRequest(req);
    if (!payload.ok) {
      return NextResponse.json(
        { error: payload.error, issues: payload.issues },
        { status: payload.status }
      );
    }

    const [existing] = await sql`
      SELECT annotated_publicid FROM pictures WHERE id = ${id}
    `;
    if (!existing) {
      return NextResponse.json({ error: "Image introuvable." }, { status: 404 });
    }

    const data = payload.data;
    const accessoryList = await prepareListForDb(data.accessories, "accessories");
    const softwareList = await prepareListForDb(data.processing_software, "processing_software");
    const accessoryParam = Array.isArray(accessoryList) ? sql.json(accessoryList) : accessoryList;
    const softwareParam = Array.isArray(softwareList) ? sql.json(softwareList) : softwareList;

    const result = await sql`
      UPDATE pictures SET
        title = ${data.title},
        target = ${data.target},
        target_category = ${data.target_category},
        publicid = ${data.publicID},
        annotated_publicid = ${data.annotatedPublicID},
        capture_date = ${data.capture_date},
        optics = ${data.optics},
        camera = ${data.camera},
        mount = ${data.mount},
        accessories = ${accessoryParam},
        focal_length = ${data.focal_length ?? null},
        f_number = ${data.f_number ?? null},
        capture_data = ${sql.json(data.capture_data)},
        processing_software = ${softwareParam},
        ra = ${data.ra ?? null},
        dec = ${data.dec ?? null},
        bortle_class = ${data.bortle_class ?? null},
        location = ${data.location}
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Image introuvable." }, { status: 404 });
    }

    const previousAnnotated = existing.annotated_publicid;
    if (
      typeof previousAnnotated === "string" &&
      previousAnnotated &&
      previousAnnotated !== data.annotatedPublicID
    ) {
      await cloudinary.uploader.destroy(previousAnnotated).catch((error: unknown) => {
        console.error(`Échec de la suppression de l'ancienne version annotée (${previousAnnotated}):`, error);
      });
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
