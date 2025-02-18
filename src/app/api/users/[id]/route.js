import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
    try {
        const id = Number(params.id);
        const user = await prisma.user.findUnique({
            where: { id: id}
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        const userData = await req.json();
        const id = Number(params.id);
        console.log(userData, id);
        const {name, newPassword} = userData;
        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: {name, password: newPassword},
        });

        return NextResponse.json({ message: "User updated", user: updatedUser }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const id = Number(params.id);
        await prisma.user.delete({
            where: { id: id },
        });

        return NextResponse.json({ message: "User deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}
