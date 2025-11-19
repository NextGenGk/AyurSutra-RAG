import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { createEmbedding } from "@/lib/embedding";

// our nurse data
import nurses from "@/data/nurses.json";

interface Nurse {
  id: string;
  name: string | null;
  specializations: string[];
  experience_years: number;
  languages: string[];
  bio: string;
  consultation_fee: string;
  home_visit_fee: string;
  available_for_home_visits: boolean;
  latitude: number;
  longitude: number;
}

function nurseToText(n: Nurse) {
  return `
Nurse Name: ${n.name || "Unknown"}
Specializations: ${n.specializations.join(", ")}
Experience: ${n.experience_years} years
Languages: ${n.languages.join(", ")}
Bio: ${n.bio}
Fees: ${n.consultation_fee} / ${n.home_visit_fee}
Available (Home Visit): ${n.available_for_home_visits}
Location: ${n.latitude}, ${n.longitude}
  `;
}

export async function GET() {
  try {
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

    const vectors = [];

    for (const nurse of nurses) {
      const content = nurseToText(nurse);
      const embedding = await createEmbedding(content);

      vectors.push({
        id: nurse.id,
        values: embedding,
        metadata: { 
          name: nurse.name || "Unknown", 
          experience_years: nurse.experience_years.toString(),
          specializations: nurse.specializations.join(", "),
          languages: nurse.languages.join(", "),
          content: content
        }
      });
    }

    // Upsert vectors to Pinecone
    await index.upsert(vectors);

    return NextResponse.json({ 
      message: "Nurses ingested successfully to Pinecone!", 
      count: vectors.length 
    });
  } catch (error) {
    console.error("Error ingesting data:", error);
    return NextResponse.json({ 
      error: "Failed to ingest data", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}