import multer from "multer";
import fs from "fs";

export const storage = () =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = "src/document_loaders/pdfs";
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Math.round(Math.random() * 1e9);
      cb(null, `${file.originalname.replace(".pdf", "")}-${uniqueSuffix}.pdf`);
    },
  });
