import { Request, Response } from "express";
import { splitTextsIntoChunks } from "../../utils/pdfs/splitTextsIntoChunks";
import { findPDFByFilename } from "../../utils/pdfs/findPDFByFilename";
import pdfService from "../../services/uploadFilesService/pdfService";

const save = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const docs = await findPDFByFilename(req.file.filename);

  const splitedDocument = await splitTextsIntoChunks(docs);

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
