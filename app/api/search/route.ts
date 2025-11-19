import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { createEmbedding } from "@/lib/embedding";

import nurses from "@/data/nurses.json";

async function performSearch(query: string) {
  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

  // Create embedding for the query using Google Gemini
  const embedding = await createEmbedding(query);

  // Search in Pinecone
  const result = await index.query({
    vector: embedding,
    topK: 5,
    includeMetadata: true,
  });

  // Get the IDs of matched nurses
  const ids = result.matches?.map((m) => m.id) || [];
  const matchedNurses = nurses.filter((n) => ids.includes(n.id));

  return {
    results: matchedNurses,
    matches: result.matches?.map(match => ({
      id: match.id,
      score: match.score,
      metadata: match.metadata
    })) || []
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    
    if (!query) {
      return NextResponse.json({ 
        error: "Query parameter is required" 
      }, { status: 400 });
    }

    const searchResults = await performSearch(query);
    return NextResponse.json(searchResults);
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json({ 
      error: "Failed to search", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ 
        error: "Query is required" 
      }, { status: 400 });
    }

    const searchResults = await performSearch(query);
    return NextResponse.json(searchResults);
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json({ 
      error: "Failed to search", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}