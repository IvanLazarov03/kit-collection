import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

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
            folder: "jerseys",
            transformation: [
              { width: 1000, height: 1000, crop: "limit", quality: "auto" },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(buffer);
    });

    // Validate required fields
    const team = formData.get("team") as string;
    const season = formData.get("season") as string;
    const size = formData.get("size") as string;
    const condition = formData.get("condition") as string;

    if (!team || !season || !size || !condition) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Save jersey data to database
    const jersey = await prisma.jersey.create({
      data: {
        team,
        season,
        player: (formData.get("player") as string) || null,
        number: (formData.get("number") as string) || null,
        size,
        condition,
        notes: (formData.get("notes") as string) || null,
        image: uploadResult.secure_url,
      },
    });

    revalidatePath("/collection");

    return NextResponse.json({ success: true, data: jersey });
  } catch (error) {
    console.error("Error uploading jersey:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
