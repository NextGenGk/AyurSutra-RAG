require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testEmbedding() {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

    try {
        console.log("Testing text-embedding-005...");
        const model = genAI.getGenerativeModel({ model: "text-embedding-005" });
        const result = await model.embedContent("test");
        console.log("✓ Success! Embedding dimension:", result.embedding.values.length);
    } catch (error) {
        console.error("✗ Error:", error.message);

        // Try text-embedding-004 as fallback
        console.log("\nTrying text-embedding-004...");
        try {
            const model2 = genAI.getGenerativeModel({ model: "text-embedding-004" });
            const result2 = await model2.embedContent("test");
            console.log("✓ Success! Embedding dimension:", result2.embedding.values.length);
        } catch (error2) {
            console.error("✗ Error:", error2.message);
        }
    }
}

testEmbedding();
