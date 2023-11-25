import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";

export const readAllpdfs = async () => {
  const loader = new DirectoryLoader("src/document_loaders/pdfs", {
    ".pdf": (fileBlob) => new PDFLoader(fileBlob),
  });

  const docs = await loader.load();

  return docs;
};
