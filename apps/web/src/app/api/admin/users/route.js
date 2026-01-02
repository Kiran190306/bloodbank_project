import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Check if user is admin
    const adminCheck = await sql`
      SELECT user_type FROM user_profiles WHERE user_id = ${userId} LIMIT 1
    `;

    if (adminCheck.length === 0 || adminCheck[0].user_type !== "admin") {
      return Response.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const userType = searchParams.get("user_type");

    let query = `
      SELECT 
        au.id,
        au.email,
        au.name,
        up.full_name,
        up.phone,
        up.user_type,
        up.created_at
      FROM auth_users au
      LEFT JOIN user_profiles up ON au.id = up.user_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 0;

    if (userType) {
      paramCount++;
      query += ` AND up.user_type = $${paramCount}`;
      values.push(userType);
    }

    query += ` ORDER BY up.created_at DESC LIMIT 200`;

    const users = await sql(query, values);
    return Response.json({ users });
  } catch (err) {
    console.error("GET /api/admin/users error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
