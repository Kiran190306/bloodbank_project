import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const bloodBanks = await sql`
      SELECT * FROM blood_banks WHERE id = ${id} LIMIT 1
    `;

    if (bloodBanks.length === 0) {
      return Response.json({ error: "Blood bank not found" }, { status: 404 });
    }

    const stock = await sql`
      SELECT * FROM blood_stock WHERE blood_bank_id = ${id}
    `;

    return Response.json({
      bloodBank: bloodBanks[0],
      stock,
    });
  } catch (err) {
    console.error("GET /api/blood-banks/[id] error", err);
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
      SELECT * FROM blood_banks WHERE id = ${id} AND user_id = ${userId} LIMIT 1
    `;

    if (existing.length === 0) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const setClauses = [];
    const values = [];
    let paramCount = 0;

    const allowedFields = [
      "hospital_name",
      "registration_number",
      "address",
      "city",
      "state",
      "pincode",
      "latitude",
      "longitude",
      "phone",
      "email",
      "operating_hours",
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
    const query = `UPDATE blood_banks SET ${setClauses.join(", ")} WHERE id = $${paramCount} RETURNING *`;
    values.push(id);

    const result = await sql(query, values);
    return Response.json({ bloodBank: result[0] });
  } catch (err) {
    console.error("PUT /api/blood-banks/[id] error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
