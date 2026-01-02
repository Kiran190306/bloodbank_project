import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
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

    // Get statistics
    const totalDonors = await sql`SELECT COUNT(*) as count FROM donor_profiles`;
    const verifiedDonors =
      await sql`SELECT COUNT(*) as count FROM donor_profiles WHERE is_verified = true`;
    const availableDonors =
      await sql`SELECT COUNT(*) as count FROM donor_profiles WHERE is_available = true AND is_verified = true`;

    const totalBloodBanks =
      await sql`SELECT COUNT(*) as count FROM blood_banks`;
    const verifiedBloodBanks =
      await sql`SELECT COUNT(*) as count FROM blood_banks WHERE is_verified = true`;

    const activeRequests =
      await sql`SELECT COUNT(*) as count FROM blood_requests WHERE status = 'active'`;
    const criticalRequests =
      await sql`SELECT COUNT(*) as count FROM blood_requests WHERE status = 'active' AND urgency_level = 'critical'`;

    const totalDonations = await sql`SELECT COUNT(*) as count FROM donations`;
    const donationsThisMonth = await sql`
      SELECT COUNT(*) as count FROM donations 
      WHERE donation_date >= DATE_TRUNC('month', CURRENT_DATE)
    `;

    // Donors by blood group
    const donorsByBloodGroup = await sql`
      SELECT blood_group, COUNT(*) as count 
      FROM donor_profiles 
      WHERE is_verified = true
      GROUP BY blood_group
      ORDER BY blood_group
    `;

    // Requests by urgency
    const requestsByUrgency = await sql`
      SELECT urgency_level, COUNT(*) as count 
      FROM blood_requests 
      WHERE status = 'active'
      GROUP BY urgency_level
    `;

    return Response.json({
      stats: {
        donors: {
          total: parseInt(totalDonors[0].count),
          verified: parseInt(verifiedDonors[0].count),
          available: parseInt(availableDonors[0].count),
        },
        bloodBanks: {
          total: parseInt(totalBloodBanks[0].count),
          verified: parseInt(verifiedBloodBanks[0].count),
        },
        requests: {
          active: parseInt(activeRequests[0].count),
          critical: parseInt(criticalRequests[0].count),
        },
        donations: {
          total: parseInt(totalDonations[0].count),
          thisMonth: parseInt(donationsThisMonth[0].count),
        },
      },
      charts: {
        donorsByBloodGroup,
        requestsByUrgency,
      },
    });
  } catch (err) {
    console.error("GET /api/admin/reports error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
