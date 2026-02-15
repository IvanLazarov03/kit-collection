import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

// Helper function to extract Cloudinary public_id from URL
function extractCloudinaryPublicId(imageUrl: string): string | null {
  try {
    const url = new URL(imageUrl);
    const pathname = url.pathname;

    const uploadIndex = pathname.indexOf("/upload/");
    if (uploadIndex === -1) return null;

    let afterUpload = pathname.substring(uploadIndex + "/upload/".length);

    // Remove version prefix (v1770991041/)
    afterUpload = afterUpload.replace(/^v\d+\//, "");

    // Remove file extension
    const publicId = afterUpload.replace(
      /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)$/i,
      "",
    );

    return publicId || null;
  } catch (err) {
    console.error("Error parsing Cloudinary URL:", err);
    return null;
  }
}

// Delete - Delete jersey
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    console.log("DELETE /api/jerseys/[id] called", { id });

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // Find the jersey first
    const jersey = await prisma.jersey.findUnique({
      where: { id },
    });

    if (!jersey) {
      return NextResponse.json({ error: "Jersey not found" }, { status: 404 });
    }

    // Delete from Cloudinary
    if (jersey.image) {
      try {
        const publicId = extractCloudinaryPublicId(jersey.image);
        console.log("Extracted public_id:", publicId);

        if (publicId) {
          const result = await cloudinary.uploader.destroy(publicId);
          console.log("Cloudinary deletion result:", result);
        }
      } catch (err) {
        console.error("Failed to remove image from Cloudinary:", err);
        // Continue with database deletion even if Cloudinary fails
      }
    }

    // Delete from database
    await prisma.jersey.delete({ where: { id } });

    // Revalidate cache
    revalidatePath("/collection");

    return NextResponse.json({
      message: "Jersey deleted successfully",
      id,
    });
  } catch (error) {
    console.error("Delete jersey error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete jersey",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
