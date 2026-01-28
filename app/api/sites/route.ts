import { NextResponse } from "next/server";

const defaultSites = [
  { id: "1", name: "Site A", capacity: 10 },
  { id: "2", name: "Site B", capacity: 20 },
  { id: "3", name: "Site C", capacity: 30 },
  { id: "4", name: "Site D", capacity: 40 },
  { id: "5", name: "Site E", capacity: 50 },
];

let sites = [...defaultSites];

export const GET = (request: Request) => {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "3");

  const start = (page - 1) * pageSize;
  const paged = sites.slice(start, start + pageSize);

  return NextResponse.json({
    sites: paged,
    pagination: {
      page,
      total: sites.length,
      pageSize,
    },
  });
};

export const POST = async (request: Request) => {
  const data = (await request.json()) as { name?: string; capacity?: number };
  const site = {
    id: `site-${Date.now()}`,
    name: data.name?.trim() || "New Site",
    capacity: data.capacity ?? 0,
  };

  sites = [site, ...sites];

  return NextResponse.json({ site }, { status: 201 });
};
