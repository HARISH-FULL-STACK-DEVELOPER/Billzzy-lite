import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { stat } from "fs";

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, error: "No file provided." });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Define the directory path where images will be stored
  const uploadsDir = join(process.cwd(), "public/uploads");

  try {
    // --- FIX: Ensure the upload directory exists ---
    // The `recursive: true` option creates parent directories if needed
    // and doesn't throw an error if the directory already exists.
    await mkdir(uploadsDir, { recursive: true });

    // Create a unique filename and the full path
    const filename = `${Date.now()}-${file.name}`;
    const path = join(uploadsDir, filename);

    // Write the file to the ensured directory
    await writeFile(path, buffer);
    console.log(`File saved to ${path}`);

    // Return the public path to be stored in the database
    return NextResponse.json({ success: true, path: `/uploads/${filename}` });

  } catch (error) {
    console.error("Error saving file:", error);
    return NextResponse.json({ success: false, error: "Failed to save file." });
  }
}