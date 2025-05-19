// File: app/api/weeklyanalysis/route.ts

import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL;
if (!BACKEND) {
  throw new Error("Missing BACKEND_URL in env");
}

export async function GET(request: NextRequest) {
  // 1) Forward the user's cookies
  const cookieHeader = request.headers.get("cookie") ?? "";

  // 2) Ask FastAPI for the weekly data
  const backendRes = await fetch(`${BACKEND}/weeklyanalysis`, {
    method: "GET",
    headers: { Cookie: cookieHeader },
  });

  // 3) If FastAPI errored, forward its error JSON or text
  if (!backendRes.ok) {
    let errBody: any;
    try {
      errBody = await backendRes.json();
    } catch {
      errBody = { detail: await backendRes.text() };
    }
    const message = errBody.detail || `Backend error (${backendRes.status})`;
    return NextResponse.json({ error: message }, { status: backendRes.status });
  }

  // 4) Parse FastAPI's JSON (could still be null/malformed)
  let data: any;
  try {
    data = await backendRes.json();
  } catch {
    console.error("[weeklyanalysis proxy] invalid JSON from backend");
    data = null;
  }

  // 5) Normalize / default‐fill
  const normalized = {
    week_start:     data?.week_start   || "",      // e.g. "2025-05-12"
    week_end:       data?.week_end     || "",      // e.g. "2025-05-18"
    pre_run_data:   Array.isArray(data?.pre_run_data)  ? data.pre_run_data  : [],
    post_run_data:  Array.isArray(data?.post_run_data) ? data.post_run_data : [],
  };

  // 6) For debugging: include a console log of what we got
  console.debug("[weeklyanalysis proxy] normalized:", normalized);

  // 7) Return the sane object
  return NextResponse.json(normalized);
}
