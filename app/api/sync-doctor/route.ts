import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { createEmbedding } from "@/lib/embedding";
import fs from "fs/promises";
import path from "path";

interface DoctorPayload {
    did: string;
    uid: string;
    specialization: string;
    qualification: string;
    registration_number: string | null;
    years_of_experience: number;
    consultation_fee: string;
    bio: string;
    clinic_name: string;
    address_line1: string;
    address_line2: string | null;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    languages: string[];
    is_verified: boolean;
    created_at?: string;
    updated_at?: string;
}

function doctorToText(d: DoctorPayload) {
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

async function updateDoctorsJSON(doctor: DoctorPayload) {
    try {
        const dataPath = path.join(process.cwd(), "data", "docters.json");

        // Read existing doctors
        const fileContent = await fs.readFile(dataPath, "utf-8");
        const doctors = JSON.parse(fileContent);

        // Check if doctor already exists
        const existingIndex = doctors.findIndex((d: any) => d.did === doctor.did);

        if (existingIndex >= 0) {
            // Update existing doctor
            doctors[existingIndex] = {
                ...doctors[existingIndex],
                ...doctor,
                idx: existingIndex
            };
        } else {
            // Add new doctor
            const newDoctor = {
                idx: doctors.length,
                ...doctor,
                created_at: doctor.created_at || new Date().toISOString(),
                updated_at: doctor.updated_at || new Date().toISOString()
            };
            doctors.push(newDoctor);
        }

        // Write back to file
        await fs.writeFile(dataPath, JSON.stringify(doctors, null, 2), "utf-8");

        return { success: true, action: existingIndex >= 0 ? "updated" : "added" };
    } catch (error) {
        console.error("Error updating doctors JSON:", error);
        return { success: false, error };
    }
}

async function syncToPinecone(doctor: DoctorPayload) {
    try {
        const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
        const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

        // Create embedding for the doctor
        const content = doctorToText(doctor);
        const embedding = await createEmbedding(content);

        // Upsert to Pinecone (upsert will update if exists, insert if new)
        await index.upsert([{
            id: doctor.did,
            values: embedding,
            metadata: {
                specialization: doctor.specialization,
                years_of_experience: doctor.years_of_experience.toString(),
                qualification: doctor.qualification,
                languages: doctor.languages.join(", "),
                clinic_name: doctor.clinic_name,
                city: doctor.city,
                content: content
            }
        }]);

        return { success: true };
    } catch (error) {
        console.error("Error syncing to Pinecone:", error);
        return { success: false, error };
    }
}

// POST endpoint for webhook from Supabase
export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Verify webhook secret (optional but recommended)
        // TEMPORARILY DISABLED FOR DEBUGGING
        // const authHeader = req.headers.get("authorization");
        // const webhookSecret = process.env.WEBHOOK_SECRET;

        // if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
        //     return NextResponse.json(
        //         { error: "Unauthorized" },
        //         { status: 401 }
        //     );
        // }

        // Extract doctor data from webhook payload
        // Supabase sends data in body.record for INSERT/UPDATE
        const doctorData: DoctorPayload = body.record || body;

        // Validate required fields
        if (!doctorData.did || !doctorData.specialization) {
            return NextResponse.json(
                { error: "Missing required fields (did, specialization)" },
                { status: 400 }
            );
        }

        // Sync to Pinecone
        const pineconeResult = await syncToPinecone(doctorData);

        // Update JSON file
        const jsonResult = await updateDoctorsJSON(doctorData);

        return NextResponse.json({
            message: "Doctor synced successfully to RAG",
            doctor_id: doctorData.did,
            pinecone: pineconeResult,
            json: jsonResult
        });

    } catch (error) {
        console.error("Error in sync-doctor webhook:", error);
        return NextResponse.json(
            {
                error: "Failed to sync doctor",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}

// GET endpoint for manual sync (for testing)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const doctorId = searchParams.get("did");

        if (!doctorId) {
            return NextResponse.json(
                { error: "Doctor ID (did) is required" },
                { status: 400 }
            );
        }

        // Read from JSON file
        const dataPath = path.join(process.cwd(), "data", "docters.json");
        const fileContent = await fs.readFile(dataPath, "utf-8");
        const doctors = JSON.parse(fileContent);

        const doctor = doctors.find((d: any) => d.did === doctorId);

        if (!doctor) {
            return NextResponse.json(
                { error: "Doctor not found in local data" },
                { status: 404 }
            );
        }

        // Sync to Pinecone
        const result = await syncToPinecone(doctor);

        return NextResponse.json({
            message: "Doctor synced to Pinecone",
            doctor_id: doctorId,
            result
        });

    } catch (error) {
        console.error("Error in manual sync:", error);
        return NextResponse.json(
            {
                error: "Failed to sync doctor",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
