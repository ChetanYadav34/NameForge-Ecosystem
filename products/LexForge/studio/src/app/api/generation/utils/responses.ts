import { NextResponse } from "next/server";

export function success<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function error(message: string, code: string, status = 500, details?: any) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        details
      }
    },
    { status }
  );
}
