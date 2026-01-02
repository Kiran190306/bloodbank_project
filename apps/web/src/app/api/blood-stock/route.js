import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { blood_group, units_available } = body;

    if (!blood_group || units_available === undefined) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get blood bank for this user
    const bloodBanks = await sql`
      SELECT id FROM blood_banks WHERE user_id = ${userId} LIMIT 1
    `;

    if (bloodBanks.length === 0) {
      return Response.json({ error: "Blood bank not found" }, { status: 404 });
    }

    const bloodBankId = bloodBanks[0].id;

    // Update stock
    const result = await sql`
      UPDATE blood_stock 
      SET units_available = ${units_available}, last_updated = CURRENT_TIMESTAMP
      WHERE blood_bank_id = ${bloodBankId} AND blood_group = ${blood_group}
      RETURNING *
    `;

    return Response.json({ stock: result[0] });
  } catch (err) {
    console.error("PUT /api/blood-stock error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
