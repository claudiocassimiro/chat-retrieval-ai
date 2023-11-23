import { PDFLoader } from "langchain/document_loaders/fs/pdf";

export const findPDFByFilename = async (filename: string) => {
  const loader = new PDFLoader(
    // eslint-disable-next-line prettier/prettier
    `src/document_loaders/pdfs/${filename}`
  );

  return loader.load();
};
