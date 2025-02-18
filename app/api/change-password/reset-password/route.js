import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); 
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { email, newPassword } = await req.json();  // Get email and new password from the request

  if (!email || !newPassword) {
    return NextResponse.json({ error: 'Email and new password are required' }, { status: 400 });
  }

  try {
    // Fetch the user from the database by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Check if user exists
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update the user's password (replacing OTP with the actual password)
    await prisma.user.update({
      where: { email },
      data: {
        password: newPassword,  // Update password to the new one
      },
    });

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
}
