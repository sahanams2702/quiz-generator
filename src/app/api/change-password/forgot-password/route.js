import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// Create transport for sending email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,  // Your email
    pass: 'zzld yasw nqqd accj',  // App-specific password
  },
});

// Function to generate OTP
const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  return otp;
};

// POST API to generate OTP and send email
export async function POST(req) {
  const { email } = await req.json(); // Parse JSON body from the request

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  // Generate OTP
  const otp = generateOtp();
  console.log(`OTP for ${email}: ${otp}`);

  try {
    // Check if user exists in the database
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Store OTP in the password field temporarily
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: otp.toString(),  // Store OTP in the password field temporarily
      },
    });

    // Set up email options
    const mailOptions = {
      from: process.env.SMTP_EMAIL, // Sender's email address
      to: email,                   // Recipient's email address
      subject: 'Your OTP for Password Reset',
      text: `Your OTP is: ${otp}`,
      html: `<strong>Your OTP is: ${otp}</strong>`,
    };

    // Send the OTP via email
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'OTP sent to your email' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
