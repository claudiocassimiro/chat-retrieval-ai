import { Request, Response } from "express";
import { splitTextsInChunks } from "../../utils/pdfs/splitTextsInChunks";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import pdfService from "../../services/uploadFilesService/pdfService";

const save = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const loader = new PDFLoader(
    // eslint-disable-next-line prettier/prettier
    `src/document_loaders/pdfs/${req.file.filename}`
  );

  const docs = await loader.load();

  const splitedDocument = await splitTextsInChunks(docs);

  if (!splitedDocument) {
    return res.status(400).json({ message: "The uploaded file was empty" });
  }

  await pdfService.save(splitedDocument);

  return res.status(200).json({ message: "File uploaded successfully" });
};

const pdfController = {
  save,
};

export default pdfController;
