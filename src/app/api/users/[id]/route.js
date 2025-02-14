import prisma from "@/lib/prisma";  // Prisma client for database interaction

export async function GET(request, { params }) {
  const { id } = params; // Extract the user ID from the route params

  try {
    // Fetch the user from the database by their ID
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id), // Assuming the `id` is an integer
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch user" }),
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = params; // Extract the user ID from the route params
  const { email, password, name } = await request.json(); // Expect updated data in the request body

  try {
    // Validate input data (you can expand this validation)
    if (!email || !password || !name) {
      return new Response(
        JSON.stringify({ error: "Email, password, and name are required" }),
        { status: 400 }
      );
    }

    // Update the user's details in the database
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        email,
        password, // You should hash the password before saving to DB
        name,
      },
    });

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update user" }),
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params; // Extract the user ID from the route params

  try {
    // Delete the user from the database
    const deletedUser = await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    return new Response(
      JSON.stringify({ message: "User deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete user" }),
      { status: 500 }
    );
  }
}
