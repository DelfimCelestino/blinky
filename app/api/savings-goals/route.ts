import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const savingsGoals = await prisma.savingsGoal.findMany();
  return NextResponse.json(savingsGoals);
}

export async function POST(request: Request) {
  const data = await request.json();
  const savingsGoal = await prisma.savingsGoal.create({ data });
  return NextResponse.json(savingsGoal);
}
