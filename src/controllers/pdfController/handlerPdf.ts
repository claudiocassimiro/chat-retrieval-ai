import { Request, Response } from "express";
import { splitTextsIntoChunks } from "../../utils/pdfs/splitTextsIntoChunks";
import { findPDFByFilename } from "../../utils/pdfs/findPDFByFilename";
import { readAllpdfs } from "../../utils/pdfs/readAllpdfs";
import handlerVectorDB from "../../services/applicationService/handlerVectorDB";
import fs from "fs";
import path from "path";

const save = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const docs = await findPDFByFilename(req.file.filename);

    const splitedDocument = await splitTextsIntoChunks(docs);

    if (!splitedDocument) {
      return res.status(400).json({ message: "The uploaded file was empty" });
    }

    await handlerVectorDB.save(splitedDocument);

    return res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error(error);
  }
};

const saveManyPdfs = async (_req: Request, res: Response) => {
  try {
    const docs = await readAllpdfs();

    const splitedDocument = await splitTextsIntoChunks(docs);

    if (!splitedDocument) {
      return res.status(400).json({ message: "The uploaded file was empty" });
    }

    await handlerVectorDB.save(splitedDocument);

    return res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error(error);
  }
};

const deleteAllDocuments = async (req: Request, res: Response) => {
  const pdfsFolder = "src/document_loaders/pdfs";

  fs.readdir(pdfsFolder, (err, files) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error when read the files", err });
    }

    files.forEach((file) => {
      const pathOfFile = path.join(pdfsFolder, file);

      fs.unlink(pathOfFile, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: `Error when delete ${pathOfFile}:`, err });
        }
      });
    });

    return res.status(204).json({ message: `files deleted with success.` });
  });
};

const pdfController = {
  save,
  deleteAllDocuments,
  saveManyPdfs,
};

export default pdfController;
