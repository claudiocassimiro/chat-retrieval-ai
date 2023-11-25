import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate } from "langchain/prompts";
import handlerVectorDB from "../services/applicationService/handlerVectorDB";

export const chatPrompt = async (question: string) => {
  const context = await handlerVectorDB.search(question);

  if (context?.length === 0) {
    return "Desculpe, mas não tenho informações sobre esse assunto";
  }

  const chat = new ChatOpenAI({ temperature: 0 });
  const chatPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Você é um assistente que ajuda pessoas na tomada de decisão com base nas informações de contexto {context}, caso você não tenha contexto sobre a resposta, apenas diga que não sabe, não dê respostas fora do seu context.",
    ],
    ["human", "{question}"],
  ]);

  const chain = new LLMChain({
    prompt: chatPrompt,
    llm: chat,
  });

  const message = await chain.call({
    context: context?.map((ctx) => ctx.pageContent),
    question,
  });

  return message;
};
