import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const bloodGroup = searchParams.get("blood_group");

    let query = `
      SELECT 
        bb.*,
        COALESCE(
          json_agg(
            json_build_object(
              'blood_group', bs.blood_group,
              'units_available', bs.units_available,
              'last_updated', bs.last_updated
            )
          ) FILTER (WHERE bs.id IS NOT NULL),
          '[]'
        ) as stock
      FROM blood_banks bb
      LEFT JOIN blood_stock bs ON bb.id = bs.blood_bank_id
      WHERE bb.is_verified = true
    `;
    const values = [];
    let paramCount = 0;

    if (city) {
      paramCount++;
      query += ` AND LOWER(bb.city) LIKE LOWER($${paramCount})`;
      values.push(`%${city}%`);
    }

    query += ` GROUP BY bb.id ORDER BY bb.created_at DESC`;

    let bloodBanks = await sql(query, values);

    // Filter by blood group if specified
    if (bloodGroup) {
      bloodBanks = bloodBanks.filter((bank) => {
        const stock = bank.stock || [];
        return stock.some(
          (s) => s.blood_group === bloodGroup && s.units_available > 0,
        );
      });
    }

    return Response.json({ bloodBanks });
  } catch (err) {
    console.error("GET /api/blood-banks error", err);
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
      hospital_name,
      registration_number,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      phone,
      email,
      operating_hours,
    } = body;

    if (!hospital_name || !address || !city) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO blood_banks (
        user_id, hospital_name, registration_number, address, city, state,
        pincode, latitude, longitude, phone, email, operating_hours
      )
      VALUES (
        ${userId}, ${hospital_name}, ${registration_number || null}, ${address}, 
        ${city}, ${state || null}, ${pincode || null}, ${latitude || null}, 
        ${longitude || null}, ${phone || null}, ${email || null}, ${operating_hours || null}
      )
      RETURNING *
    `;

    // Initialize blood stock for all blood groups
    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const bloodBankId = result[0].id;

    for (const group of bloodGroups) {
      await sql`
        INSERT INTO blood_stock (blood_bank_id, blood_group, units_available)
        VALUES (${bloodBankId}, ${group}, 0)
      `;
    }

    return Response.json({ bloodBank: result[0] });
  } catch (err) {
    console.error("POST /api/blood-banks error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
