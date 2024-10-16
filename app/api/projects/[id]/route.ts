import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(project, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error updating project:", error.message);
      return NextResponse.json(
        { error: "Erro do banco de dados ao atualizar o projeto" },
        { status: 500 }
      );
    }
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar projeto" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Obter o ID da URL
    const { pathname } = new URL(request.url);
    const id = pathname.split("/").pop(); // Assume que o ID está na última parte da URL

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Projeto excluído com sucesso" },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error deleting project:", error.message);
      return NextResponse.json(
        { error: "Erro do banco de dados ao excluir o projeto" },
        { status: 500 }
      );
    }
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Erro ao excluir projeto" },
      { status: 500 }
    );
  }
}
