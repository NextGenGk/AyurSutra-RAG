import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function createEmbedding(text: string) {
  // Use text-embedding-005 which produces 1024 dimensions
  const modelName = process.env.GOOGLE_EMBEDDING_MODEL || "text-embedding-005";
  const model = genAI.getGenerativeModel({ model: modelName });

  const result = await model.embedContent(text);
  return result.embedding.values;
}
