/* eslint-disable prettier/prettier */
import prisma from "../../lib/prisma";
import { PrismaVectorStore } from "langchain/vectorstores/prisma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Prisma, Document as PrismaDocument } from "@prisma/client";
import { Document } from "langchain/dist/document";

export const save = async (embedDocs: Document<Record<string, any>>[]) => {
  try {
    const vectorStore = PrismaVectorStore.withModel<PrismaDocument>(
      prisma
    ).create(new OpenAIEmbeddings(), {
      prisma: Prisma,
      tableName: "Document",
      vectorColumnName: "vector",
      columns: {
        id: PrismaVectorStore.IdColumn,
        content: PrismaVectorStore.ContentColumn,
      },
    });

    await vectorStore.addModels(
      await prisma.$transaction(
        embedDocs.map((content) =>
          prisma.document.create({
            data: { content: content.pageContent },
          })
        )
      )
    );
  } catch (error) {
    console.error(error);
  }
};

const pdfService = {
  save,
};

export default pdfService;
