import { Document } from "langchain/dist/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const splitTextsIntoChunks = async (
  // eslint-disable-next-line prettier/prettier
  docs: Document<Record<string, any>>[]
) => {
  try {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    return textSplitter.splitDocuments(docs);
  } catch (error) {
    console.error(error);
  }
};
