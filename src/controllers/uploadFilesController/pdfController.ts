import { Request, Response } from "express";
import { splitTextsInChunks } from "../../utils/pdfs/splitTextsInChunks";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import pdfService from "../../services/uploadFilesService/pdfService";
import { ChatPromptTemplate } from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMChain } from "langchain/chains";

export const save = async (req: Request, res: Response) => {
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

export const question = async (req: Request, res: Response) => {
  const { question } = req.body;

  try {
    const context = await pdfService.search(question);

    const chat = new ChatOpenAI({ temperature: 0 });
    const chatPrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "Você é um assistente que ajuda pessoas na tomada de decisão com base nas informações de contexto {context}, caso você não tenha contexto sobre a resposta, apenas diga que não sabe, não dê respostas fora do seu context.",
      ],
      ["human", "{question}"],
    ]);
    const chainB = new LLMChain({
      prompt: chatPrompt,
      llm: chat,
    });

    const message = await chainB.call({
      context: context?.map((ctx) => ctx.pageContent),
      question,
    });

    return res.status(200).json({ message });
  } catch (error) {
    console.error(error);
  }
};

const pdfController = {
  save,
  question,
};

export default pdfController;
