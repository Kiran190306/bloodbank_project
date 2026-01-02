import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const bloodGroup = searchParams.get("blood_group");
    const city = searchParams.get("city");
    const available = searchParams.get("available");

    let query = `
      SELECT 
        dp.*,
        up.full_name,
        up.phone
      FROM donor_profiles dp
      JOIN user_profiles up ON dp.user_id = up.user_id
      WHERE dp.is_verified = true
    `;
    const values = [];
    let paramCount = 0;

    if (bloodGroup) {
      paramCount++;
      query += ` AND dp.blood_group = $${paramCount}`;
      values.push(bloodGroup);
    }

    if (city) {
      paramCount++;
      query += ` AND LOWER(dp.city) LIKE LOWER($${paramCount})`;
      values.push(`%${city}%`);
    }

    if (available === "true") {
      query += ` AND dp.is_available = true`;
    }

    query += ` ORDER BY dp.created_at DESC LIMIT 100`;

    const donors = await sql(query, values);
    return Response.json({ donors });
  } catch (err) {
    console.error("GET /api/donors error", err);
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
      blood_group,
      date_of_birth,
      gender,
      weight,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      last_donation_date,
      medical_conditions,
    } = body;

    if (!blood_group || !city) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO donor_profiles (
        user_id, blood_group, date_of_birth, gender, weight,
        address, city, state, pincode, latitude, longitude,
        last_donation_date, medical_conditions
      )
      VALUES (
        ${userId}, ${blood_group}, ${date_of_birth || null}, ${gender || null}, ${weight || null},
        ${address || null}, ${city}, ${state || null}, ${pincode || null}, 
        ${latitude || null}, ${longitude || null}, ${last_donation_date || null}, 
        ${medical_conditions || null}
      )
      RETURNING *
    `;

    return Response.json({ donor: result[0] });
  } catch (err) {
    console.error("POST /api/donors error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
