import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "active";
    const bloodGroup = searchParams.get("blood_group");
    const city = searchParams.get("city");

    let query = `
      SELECT 
        br.*,
        up.full_name as requester_name
      FROM blood_requests br
      LEFT JOIN user_profiles up ON br.requester_id = up.user_id
      WHERE br.status = $1
    `;
    const values = [status];
    let paramCount = 1;

    if (bloodGroup) {
      paramCount++;
      query += ` AND br.blood_group = $${paramCount}`;
      values.push(bloodGroup);
    }

    if (city) {
      paramCount++;
      query += ` AND LOWER(br.city) LIKE LOWER($${paramCount})`;
      values.push(`%${city}%`);
    }

    query += ` ORDER BY 
      CASE br.urgency_level 
        WHEN 'critical' THEN 1 
        WHEN 'urgent' THEN 2 
        ELSE 3 
      END,
      br.created_at DESC
      LIMIT 100
    `;

    const requests = await sql(query, values);
    return Response.json({ requests });
  } catch (err) {
    console.error("GET /api/blood-requests error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const {
      requester_type,
      patient_name,
      blood_group,
      units_needed,
      urgency_level,
      hospital_name,
      contact_phone,
      city,
      state,
      latitude,
      longitude,
      required_by,
      description,
    } = body;

    if (
      !patient_name ||
      !blood_group ||
      !units_needed ||
      !contact_phone ||
      !city
    ) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO blood_requests (
        requester_id, requester_type, patient_name, blood_group, units_needed,
        urgency_level, hospital_name, contact_phone, city, state, latitude,
        longitude, required_by, description
      )
      VALUES (
        ${userId}, ${requester_type || "patient"}, ${patient_name}, ${blood_group}, 
        ${units_needed}, ${urgency_level || "normal"}, ${hospital_name || null}, 
        ${contact_phone}, ${city}, ${state || null}, ${latitude || null}, 
        ${longitude || null}, ${required_by || null}, ${description || null}
      )
      RETURNING *
    `;

    return Response.json({ request: result[0] });
  } catch (err) {
    console.error("POST /api/blood-requests error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
