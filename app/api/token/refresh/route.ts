import { NextResponse } from "next/server";

export const POST = () => {
  return NextResponse.json({ token: "demo-token" });
};
