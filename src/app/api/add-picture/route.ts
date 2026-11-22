// app/api/add-picture/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@root/auth";
import sql from "@/app/lib/data";
import { prepareListForDb } from "@/app/lib/list-columns";
import { readPictureRequest } from "@/app/lib/picture-request";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await readPictureRequest(req);
    if (!payload.ok) {
      return NextResponse.json(
        { error: payload.error, issues: payload.issues },
        { status: payload.status }
      );
    }

    const data = payload.data;
    const accessoryList = await prepareListForDb(data.accessories, "accessories");
    const softwareList = await prepareListForDb(data.processing_software, "processing_software");
    const accessoryParam = Array.isArray(accessoryList) ? sql.json(accessoryList) : accessoryList;
    const softwareParam = Array.isArray(softwareList) ? sql.json(softwareList) : softwareList;

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
        ${data.title},
        ${data.target},
        ${data.target_category},
        ${data.publicID},
        ${data.annotatedPublicID},
        ${data.capture_date},
        ${data.optics},
        ${data.camera},
        ${data.mount},
        ${accessoryParam},
        ${data.focal_length ?? null},
        ${data.f_number ?? null},
        ${sql.json(data.capture_data)},
        ${softwareParam},
        ${data.ra ?? null},
        ${data.dec ?? null},
        ${data.bortle_class ?? null},
        ${data.location}
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
