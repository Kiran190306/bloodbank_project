import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// This route allows creating the first admin user
// After creating your admin account, you should delete this file for security
export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { full_name, phone } = body;

    // Check if user already has a profile
    const existing = await sql`
      SELECT * FROM user_profiles WHERE user_id = ${userId} LIMIT 1
    `;

    if (existing.length > 0) {
      return Response.json(
        { error: "User already has a profile" },
        { status: 400 },
      );
    }

    // Create admin profile
    const result = await sql`
      INSERT INTO user_profiles (user_id, full_name, phone, user_type)
      VALUES (${userId}, ${full_name || "Admin"}, ${phone || null}, 'admin')
      RETURNING *
    `;

    return Response.json({
      success: true,
      message:
        "Admin profile created successfully. Please delete /apps/web/src/app/api/admin/promote/route.js for security.",
      profile: result[0],
    });
  } catch (err) {
    console.error("POST /api/admin/promote error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
