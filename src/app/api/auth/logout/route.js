import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    (await cookies()).delete('user_id');
    (await cookies()).delete('user_role');
    return NextResponse.json({message: "User Logout"},{ status: 200})
}