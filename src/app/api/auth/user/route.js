import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    const userId = (await cookies()).get("user_id")?.value;

    if (!userId) {
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    return NextResponse.json({ userId }, { status: 200 });
}
