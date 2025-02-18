import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables

const prisma = new PrismaClient();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,  // Your email
    pass: 'zzld yasw nqqd accj',  // Your generated app-specific password
  },
});

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
    }

    // Save the contact details to the database using Prisma
    const newContact = await prisma.contact.create({
      data: { name, email, message },
    });

    // Send email to the user with a confirmation of their message
    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_EMAIL}>`, // Your email
      replyTo: email, // Replies go to the user
      to: email, // Send a copy to the user
      subject: `Contact Form Submission from ${name}`,
      text: `Hi ${name},\n\nThank you for reaching out! Here is a copy of your message:\n\n"${message}"\n\nWe will get back to you soon!\n\nBest regards,\nQuizEZ Team`,
    });

    // Respond with success and the saved contact data
    return new Response(JSON.stringify({ success: true, data: newContact }), { status: 201 });
  } catch (error) {
    console.error('Error saving contact:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
