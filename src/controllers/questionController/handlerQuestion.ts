import { Request, Response } from "express";
import pdfService from "../../services/uploadFilesService/pdfService";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

const question = async (req: Request, res: Response) => {
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

const questionController = {
  question,
};

export default questionController;
