import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { createEmbedding } from "@/lib/embedding";

// our doctor data
import doctors from "@/data/docters.json";

interface Doctor {
  idx: number;
  did: string;
  uid: string;
  specialization: string;
  qualification: string;
  registration_number: string | null;
  years_of_experience: number;
  consultation_fee: string | number;
  bio: string;
  clinic_name: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  languages: string[];
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

function doctorToText(d: Doctor) {
  const address = [
    d.address_line1,
    d.address_line2,
    d.city,
    d.state,
    d.postal_code
  ].filter(Boolean).join(", ");

  return `
Doctor Specialization: ${d.specialization}
Qualification: ${d.qualification}
Registration: ${d.registration_number || "Not specified"}
Experience: ${d.years_of_experience} years
Languages: ${d.languages.join(", ")}
Bio: ${d.bio}
Consultation Fee: ₹${d.consultation_fee}
Clinic: ${d.clinic_name}
Address: ${address}
Verified: ${d.is_verified ? "Yes" : "No"}
  `;
}

export async function GET() {
  try {
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

    const vectors = [];

    for (const doctor of doctors) {
      const content = doctorToText(doctor);
      const embedding = await createEmbedding(content);

      vectors.push({
        id: doctor.did,
        values: embedding,
        metadata: {
          specialization: doctor.specialization,
          years_of_experience: doctor.years_of_experience.toString(),
          qualification: doctor.qualification,
          languages: doctor.languages.join(", "),
          clinic_name: doctor.clinic_name || "Not specified",
          city: doctor.city || "Not specified",
          content: content
        }
      });
    }

    // Upsert vectors to Pinecone
    await index.upsert(vectors);

    return NextResponse.json({
      message: "Doctors ingested successfully to Pinecone!",
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