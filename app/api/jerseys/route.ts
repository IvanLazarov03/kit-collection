import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";

// POST — Create new jersey with image upload
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "jerseys", // optional Cloudinary folder
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(buffer);
    });

    // Save jersey data to database
    const jersey = await prisma.jersey.create({
      data: {
        team: formData.get("team") as string,
        season: formData.get("season") as string,
        player: (formData.get("player") as string) || null,
        number: (formData.get("number") as string) || null,
        size: formData.get("size") as string,
        condition: formData.get("condition") as string,
        notes: (formData.get("notes") as string) || null,
        image: uploadResult.secure_url, // ✅ Cloudinary image URL
      },
    });

    return NextResponse.json({ success: true, data: jersey });
  } catch (error) {
    console.error("Error uploading jersey:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
