require("dotenv").config();
const { Pinecone } = require("@pinecone-database/pinecone");

async function createIndex() {
  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

  try {
    // Check if index already exists
    const existingIndexes = await pinecone.listIndexes();
    const indexExists = existingIndexes.indexes?.some(
      (index) => index.name === process.env.PINECONE_INDEX_NAME
    );

    if (indexExists) {
      console.log(`Index ${process.env.PINECONE_INDEX_NAME} already exists`);
      return;
    }

    // Create the index with 768 dimensions (Google text-embedding-004)
    await pinecone.createIndex({
      name: process.env.PINECONE_INDEX_NAME,
      dimension: 768,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });

    console.log(
      `Index ${process.env.PINECONE_INDEX_NAME} created successfully!`
    );
  } catch (error) {
    console.error("Error creating index:", error);
  }
}

createIndex();
