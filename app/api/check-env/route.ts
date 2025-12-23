import { NextResponse } from "next/server";

// Simple diagnostic endpoint to check environment variables
export async function GET() {
    return NextResponse.json({
        hasWebhookSecret: !!process.env.WEBHOOK_SECRET,
        secretLength: process.env.WEBHOOK_SECRET?.length || 0,
        secretPreview: process.env.WEBHOOK_SECRET?.substring(0, 10) + '...' || 'NOT SET',
        allEnvKeys: Object.keys(process.env).filter(k => k.includes('WEBHOOK') || k.includes('PINECONE') || k.includes('GOOGLE'))
    });
}
