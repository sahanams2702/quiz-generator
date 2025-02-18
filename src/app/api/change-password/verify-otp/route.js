import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); 
import { NextResponse } from 'next/server';

// Verify OTP API handler
export async function POST(req) {
  const { email, otpInput } = await req.json(); // Get email and OTP input from the request

  if (!email || !otpInput) {
    return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
  }

  try {
    // Fetch user from the database by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Check if the user exists
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the stored OTP matches the input OTP
    if (parseInt(otpInput) === parseInt(user.password)) {  // OTP stored in the password field temporarily
      return NextResponse.json({ message: 'OTP verified successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid OTP or email' }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
}
