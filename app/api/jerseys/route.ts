import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";

//Post request for creating new entries
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadsDir, { recursive: true });

    //Save image
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${image.name.replace(/\s/g, "-")}`;
    const filepath = path.join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    //Save to db
    const jersey = await prisma.jersey.create({
      data: {
        team: formData.get("team") as string,
        season: formData.get("season") as string,
        player: (formData.get("player") as string) || null,
        number: (formData.get("number") as string) || null,
        size: formData.get("size") as string,
        condition: formData.get("condition") as string,
        notes: (formData.get("notes") as string) || null,
        image: `/uploads/${filename}`,
      },
    });

    return NextResponse.json({ success: true, data: jersey });
  } catch (error) {
    console.error("Error uploading jersey:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
      },
      { status: 500 },
    );
  }
}
