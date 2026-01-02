import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const donors = await sql`
      SELECT 
        dp.*,
        up.full_name,
        up.phone
      FROM donor_profiles dp
      JOIN user_profiles up ON dp.user_id = up.user_id
      WHERE dp.id = ${id}
      LIMIT 1
    `;

    if (donors.length === 0) {
      return Response.json({ error: "Donor not found" }, { status: 404 });
    }

    return Response.json({ donor: donors[0] });
  } catch (err) {
    console.error("GET /api/donors/[id] error", err);
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
      SELECT * FROM donor_profiles WHERE id = ${id} AND user_id = ${userId} LIMIT 1
    `;

    if (existing.length === 0) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const setClauses = [];
    const values = [];
    let paramCount = 0;

    const allowedFields = [
      "blood_group",
      "date_of_birth",
      "gender",
      "weight",
      "address",
      "city",
      "state",
      "pincode",
      "latitude",
      "longitude",
      "last_donation_date",
      "is_available",
      "medical_conditions",
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        paramCount++;
        setClauses.push(`${field} = $${paramCount}`);
        values.push(body[field]);
      }
    });

    if (setClauses.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    paramCount++;
    setClauses.push(`updated_at = CURRENT_TIMESTAMP`);

    paramCount++;
    const query = `UPDATE donor_profiles SET ${setClauses.join(", ")} WHERE id = $${paramCount} RETURNING *`;
    values.push(id);

    const result = await sql(query, values);
    return Response.json({ donor: result[0] });
  } catch (err) {
    console.error("PUT /api/donors/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
