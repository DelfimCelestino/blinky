import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const income = await prisma.income.findMany();
  return NextResponse.json(income);
}

export async function POST(request: Request) {
  const data = await request.json();
  const income = await prisma.income.create({ data });
  return NextResponse.json(income);
}
