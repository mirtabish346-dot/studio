
import { NextRequest, NextResponse } from "next/server";
import { runFlow } from "@genkit-ai/next";
import { generateInitialAdminUser } from "@/ai/flows/generate-initial-admin-user";

export async function GET(req: NextRequest) {
  try {
    console.log("Attempting to create initial admin user via runFlow...");

    const result = await runFlow(generateInitialAdminUser, {
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
    
    // The error from runFlow might be a stringified JSON
    let errorMessage = error.message || "Failed to create admin user.";
    try {
        const parsedError = JSON.parse(errorMessage);
        if (parsedError.details && parsedError.details.includes("EMAIL_EXISTS")) {
             return NextResponse.json(
                { error: "Admin user already exists." },
                { status: 409 }
            );
        }
        errorMessage = parsedError.details || errorMessage;
    } catch (e) {
        // Not a JSON error, use original message
        if (errorMessage.includes("EMAIL_EXISTS")) {
             return NextResponse.json(
                { error: "Admin user already exists." },
                { status: 409 }
            );
        }
    }
    
    return NextResponse.json(
      { error: "Failed to create admin user.", details: errorMessage },
      { status: 500 }
    );
  }
}
