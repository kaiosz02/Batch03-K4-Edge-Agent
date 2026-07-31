import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file");
  if (!file) return new NextResponse("File missing", { status: 400 });

  // Access the parent directory's data folder (outside frontend)
  const filePath = join(process.cwd(), "..", "data", "vlearn-pack", "slides", file);
  
  try {
    const buffer = readFileSync(filePath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        // Allow rendering in iframe within the same origin
        "X-Frame-Options": "SAMEORIGIN",
      },
    });
  } catch (error) {
    console.error("Error reading PDF:", error);
    return new NextResponse("File not found", { status: 404 });
  }
}
