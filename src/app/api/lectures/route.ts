import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { checkRateLimit } from "@/lib/rate-limit";

// Mock lecture creation since DB isn't wired yet.
export async function POST(req: NextRequest) {
  try {
    // 1. IP-based rate limiting (simple mock)
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
    const rl = checkRateLimit(ip, 10, 60000); // 10 requests per minute
    if (!rl.success) {
      return apiError("RATE_LIMITED", "Too many requests", 429);
    }

    // 2. Parse payload
    const body = await req.json();
    const { title, sourceType, audioPath, language, networkMode } = body;

    if (!title || !sourceType) {
      return apiError(
        "VALIDATION_ERROR",
        "Missing required fields (title, sourceType)",
        400
      );
    }

    // 3. Mock saving to DB (Supabase not wired)
    const data = {
      id: crypto.randomUUID(),
      title,
      status: "uploaded",
      createdAt: new Date().toISOString(),
    };

    // 4. Return correct envelope
    return apiSuccess(data, 201);
  } catch (err: any) {
    return apiError("INTERNAL_ERROR", "Failed to process request", 500, err.message);
  }
}
