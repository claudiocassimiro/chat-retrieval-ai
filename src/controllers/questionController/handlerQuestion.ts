import { Request, Response } from "express";
import { chatPrompt } from "../../prompts/chatPrompt";

const question = async (req: Request, res: Response) => {
  const { question } = req.body;

  if (!question) {
    return res
      .status(400)
      .json({ message: "The question should not be empty" });
  }

  try {
    const message = await chatPrompt(question);

    return res.status(200).json({ message });
  } catch (error) {
    console.error(error);
  }
};

const questionController = {
  question,
};

export default questionController;
