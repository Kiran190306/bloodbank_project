import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user profile
    const userProfiles = await sql`
      SELECT * FROM user_profiles WHERE user_id = ${userId} LIMIT 1
    `;

    const userProfile = userProfiles?.[0] || null;

    // Get additional profile based on user type
    let additionalProfile = null;
    if (userProfile) {
      if (userProfile.user_type === "donor") {
        const donorProfiles = await sql`
          SELECT * FROM donor_profiles WHERE user_id = ${userId} LIMIT 1
        `;
        additionalProfile = donorProfiles?.[0] || null;
      } else if (userProfile.user_type === "hospital") {
        const bloodBanks = await sql`
          SELECT * FROM blood_banks WHERE user_id = ${userId} LIMIT 1
        `;
        additionalProfile = bloodBanks?.[0] || null;
      }
    }

    return Response.json({
      user: session.user,
      userProfile,
      additionalProfile,
    });
  } catch (err) {
    console.error("GET /api/profile error", err);
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
    const { full_name, phone, user_type } = body;

    if (!full_name || !user_type) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create user profile
    const result = await sql`
      INSERT INTO user_profiles (user_id, full_name, phone, user_type)
      VALUES (${userId}, ${full_name}, ${phone || null}, ${user_type})
      RETURNING *
    `;

    return Response.json({ userProfile: result[0] });
  } catch (err) {
    console.error("POST /api/profile error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { full_name, phone } = body;

    const setClauses = [];
    const values = [];
    let paramCount = 0;

    if (full_name) {
      paramCount++;
      setClauses.push(`full_name = $${paramCount}`);
      values.push(full_name);
    }

    if (phone !== undefined) {
      paramCount++;
      setClauses.push(`phone = $${paramCount}`);
      values.push(phone);
    }

    paramCount++;
    setClauses.push(`updated_at = CURRENT_TIMESTAMP`);

    if (setClauses.length === 1) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    paramCount++;
    const query = `UPDATE user_profiles SET ${setClauses.join(", ")} WHERE user_id = $${paramCount} RETURNING *`;
    values.push(userId);

    const result = await sql(query, values);
    return Response.json({ userProfile: result[0] });
  } catch (err) {
    console.error("PUT /api/profile error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
