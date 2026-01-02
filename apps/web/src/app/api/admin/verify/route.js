import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
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

    const body = await request.json();
    const { entity_type, entity_id, is_verified } = body;

    if (!entity_type || !entity_id || is_verified === undefined) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    let result;
    if (entity_type === "donor") {
      result = await sql`
        UPDATE donor_profiles 
        SET is_verified = ${is_verified}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${entity_id}
        RETURNING *
      `;
    } else if (entity_type === "hospital") {
      result = await sql`
        UPDATE blood_banks 
        SET is_verified = ${is_verified}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${entity_id}
        RETURNING *
      `;
    } else {
      return Response.json({ error: "Invalid entity type" }, { status: 400 });
    }

    return Response.json({ success: true, entity: result[0] });
  } catch (err) {
    console.error("POST /api/admin/verify error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
