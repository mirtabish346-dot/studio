
import { NextRequest, NextResponse } from "next/server";
import { generateInitialAdminUser } from "@/ai/flows/generate-initial-admin-user";

export async function GET(req: NextRequest) {
  try {
    console.log("Attempting to create initial admin user...");

    const result = await generateInitialAdminUser({
      prompt:
        "Create an admin user with email admin@omniserve.com and password Admin@123",
    });

    console.log("Admin user creation successful:", result);
    return NextResponse.json({
      message: "Admin user created successfully!",
      user: {
        uid: result.uid,
        email: result.email,
      },
    });
  } catch (error: any) {
    console.error("Error creating admin user:", error);
    // Check for a specific error if the user already exists
    if (error.code === 'auth/email-already-exists' || (error.message && error.message.includes("EMAIL_EXISTS"))) {
        return NextResponse.json(
            { error: "Admin user already exists." },
            { status: 409 }
        );
    }
    
    return NextResponse.json(
      { error: "Failed to create admin user.", details: error.message },
      { status: 500 }
    );
  }
}
