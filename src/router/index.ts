import { Router } from "express";
import multer from "multer";
import pdfController from "../controllers/pdfController/handlerPdf";
import questionController from "../controllers/questionController/handlerQuestion";
import { storage } from "../utils/multer/storage";

const router = Router();

const upload = multer({ storage: storage() });

router.post("/api/files", upload.single("file"), pdfController.save);
router.delete("/api/deleteAllDocs", pdfController.deleteAllDocuments);
router.post("/api/question", questionController.question);

export default router;
