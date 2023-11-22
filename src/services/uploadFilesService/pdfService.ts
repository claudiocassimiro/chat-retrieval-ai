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

export const search = async (question: string) => {
  try {
    const vectorStore = new PrismaVectorStore(new OpenAIEmbeddings(), {
      db: prisma,
      prisma: Prisma,
      tableName: "Document",
      vectorColumnName: "vector",
      columns: {
        id: PrismaVectorStore.IdColumn,
        content: PrismaVectorStore.ContentColumn,
      },
    });

    const documents = await vectorStore.similaritySearch(question, 10);

    const context = documents.filter((document) => {
      if (document.metadata?._distance) {
        return (
          Number(
            document.metadata._distance
              .toString()
              .match(/^-?\d+(\.\d{1,2})?/)?.[0] || 0
          ) <= 0.24
        );
      }
    });

    return context;
  } catch (error) {
    console.error(error);
  }
};

const pdfService = {
  save,
  search,
};

export default pdfService;
