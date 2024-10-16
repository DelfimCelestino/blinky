import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const expenses = await prisma.expense.findMany();
  return NextResponse.json(expenses);
}

export async function POST(request: Request) {
  const data = await request.json();
  const expense = await prisma.expense.create({ data });
  return NextResponse.json(expense);
}
