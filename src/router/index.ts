import { Router } from "express";
import multer from "multer";
import pdfController from "../controllers/uploadFilesController/pdfController";
import { storage } from "../utils/multer/storage";

const router = Router();

const upload = multer({ storage: storage() });

router.get("/", (_req, _res) => console.log("Hello, world!"));
router.post("/api/files", upload.single("file"), pdfController.save);
router.post("/api/question", pdfController.question);

export default router;
