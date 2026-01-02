import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const requests = await sql`
      SELECT 
        br.*,
        up.full_name as requester_name,
        up.phone as requester_phone
      FROM blood_requests br
      LEFT JOIN user_profiles up ON br.requester_id = up.user_id
      WHERE br.id = ${id}
      LIMIT 1
    `;

    if (requests.length === 0) {
      return Response.json({ error: "Request not found" }, { status: 404 });
    }

    return Response.json({ request: requests[0] });
  } catch (err) {
    console.error("GET /api/blood-requests/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const userId = session.user.id;
    const body = await request.json();

    // Verify ownership
    const existing = await sql`
      SELECT * FROM blood_requests WHERE id = ${id} AND requester_id = ${userId} LIMIT 1
    `;

    if (existing.length === 0) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status } = body;

    if (!status) {
      return Response.json({ error: "Status is required" }, { status: 400 });
    }

    const result = await sql`
      UPDATE blood_requests 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    return Response.json({ request: result[0] });
  } catch (err) {
    console.error("PUT /api/blood-requests/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
