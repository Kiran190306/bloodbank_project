import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  Droplet,
  Heart,
  AlertCircle,
  MapPin,
  Phone,
  Calendar,
  Users,
  Building2,
  Shield,
  LogOut,
  Search,
  Plus,
} from "lucide-react";

export default function DashboardPage() {
  const { data: user, loading: userLoading } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [stock, setStock] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);

          // Fetch additional data based on user type
          if (data.userProfile?.user_type === "donor") {
            fetchDonorRequests();
          } else if (data.userProfile?.user_type === "hospital") {
            fetchBloodStock();
          } else if (data.userProfile?.user_type === "admin") {
            fetchAdminStats();
          }
        } else {
          window.location.href = "/onboarding";
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading && user) {
      fetchProfile();
    } else if (!userLoading && !user) {
      window.location.href = "/account/signin";
    }
  }, [user, userLoading]);

  const fetchDonorRequests = async () => {
    try {
      const res = await fetch("/api/blood-requests?status=active");
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests.slice(0, 5));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBloodStock = async () => {
    try {
      if (!profile?.additionalProfile?.id) return;
      const res = await fetch(
        `/api/blood-banks/${profile.additionalProfile.id}`,
      );
      if (res.ok) {
        const data = await res.json();
        setStock(data.stock || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const res = await fetch("/api/admin/reports");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const BloodTypeBadge = ({ type }) => {
    const colors = {
      "A+": "bg-red-100 text-red-700",
      "A-": "bg-red-100 text-red-700",
      "B+": "bg-blue-100 text-blue-700",
      "B-": "bg-blue-100 text-blue-700",
      "AB+": "bg-purple-100 text-purple-700",
      "AB-": "bg-purple-100 text-purple-700",
      "O+": "bg-green-100 text-green-700",
      "O-": "bg-green-100 text-green-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${colors[type] || "bg-gray-100 text-gray-700"}`}
      >
        {type}
      </span>
    );
  };

  if (loading || userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const userType = profile?.userProfile?.user_type;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center gap-2">
              <div className="bg-red-600 p-2 rounded-lg">
                <Droplet className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                BloodConnect
              </span>
            </a>
            <div className="flex items-center gap-4">
              <a
                href="/search"
                className="text-gray-700 hover:text-red-600 font-medium"
              >
                Search Blood
              </a>
              <a
                href="/emergency"
                className="text-gray-700 hover:text-red-600 font-medium"
              >
                Emergency Request
              </a>
              <a
                href="/account/logout"
                className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.userProfile?.full_name || user?.name}!
          </h1>
          <p className="text-gray-600">
            {userType === "donor" && "Thank you for being a life-saver"}
            {userType === "hospital" && "Manage your blood bank inventory"}
            {userType === "admin" && "System administration dashboard"}
          </p>
        </div>

        {/* Donor Dashboard */}
        {userType === "donor" && (
          <>
            {/* Profile Card */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      Your Donor Profile
                    </h2>
                    {profile?.additionalProfile?.is_verified ? (
                      <span className="text-sm text-green-600 font-medium">
                        ✓ Verified Donor
                      </span>
                    ) : (
                      <span className="text-sm text-yellow-600 font-medium">
                        ⏳ Pending Verification
                      </span>
                    )}
                  </div>
                  <BloodTypeBadge
                    type={profile?.additionalProfile?.blood_group}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {profile?.additionalProfile?.city}
                      {profile?.additionalProfile?.state &&
                        `, ${profile.additionalProfile.state}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{profile?.userProfile?.phone || "Not provided"}</span>
                  </div>
                  {profile?.additionalProfile?.last_donation_date && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Last donation:{" "}
                        {new Date(
                          profile.additionalProfile.last_donation_date,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Heart
                      className={`w-4 h-4 ${profile?.additionalProfile?.is_available ? "text-green-600" : "text-gray-400"}`}
                    />
                    <span
                      className={
                        profile?.additionalProfile?.is_available
                          ? "text-green-600 font-medium"
                          : "text-gray-600"
                      }
                    >
                      {profile?.additionalProfile?.is_available
                        ? "Available to donate"
                        : "Not available"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg shadow-md p-6 text-white">
                <Heart className="w-12 h-12 mb-4 opacity-80" />
                <h3 className="text-2xl font-bold mb-2">Save Lives</h3>
                <p className="text-red-100 mb-4">
                  Your donation can save up to 3 lives
                </p>
                <a
                  href="/emergency"
                  className="inline-block bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50"
                >
                  View Requests
                </a>
              </div>
            </div>

            {/* Emergency Requests */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Active Blood Requests
                </h2>
                <a
                  href="/emergency"
                  className="text-red-600 hover:text-red-700 font-medium text-sm"
                >
                  View All →
                </a>
              </div>

              {requests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No active requests at the moment
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {request.patient_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {request.hospital_name || "Hospital not specified"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <BloodTypeBadge type={request.blood_group} />
                          {request.urgency_level === "critical" && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                              CRITICAL
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{request.city}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{request.units_needed} units needed</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <span>{request.contact_phone}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Hospital Dashboard */}
        {userType === "hospital" && (
          <>
            {/* Hospital Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {profile?.additionalProfile?.hospital_name}
                  </h2>
                  {profile?.additionalProfile?.is_verified ? (
                    <span className="text-sm text-green-600 font-medium">
                      ✓ Verified Blood Bank
                    </span>
                  ) : (
                    <span className="text-sm text-yellow-600 font-medium">
                      ⏳ Pending Verification
                    </span>
                  )}
                </div>
                <Building2 className="w-8 h-8 text-red-600" />
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    {profile?.additionalProfile?.address},{" "}
                    {profile?.additionalProfile?.city}
                    {profile?.additionalProfile?.state &&
                      `, ${profile.additionalProfile.state}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>
                    {profile?.additionalProfile?.phone || "Not provided"}
                  </span>
                </div>
              </div>
            </div>

            {/* Blood Stock */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Blood Stock Inventory
                </h2>
                <button className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  Update Stock
                </button>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                {stock.map((item) => (
                  <div
                    key={item.blood_group}
                    className="border border-gray-200 rounded-lg p-4 text-center"
                  >
                    <BloodTypeBadge type={item.blood_group} />
                    <div className="mt-3">
                      <div className="text-3xl font-bold text-gray-900">
                        {item.units_available}
                      </div>
                      <div className="text-sm text-gray-600">
                        units available
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Updated {new Date(item.last_updated).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <a
                href="/emergency"
                className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg shadow-md p-6 text-white hover:from-red-700 hover:to-red-800 transition-colors"
              >
                <AlertCircle className="w-10 h-10 mb-3 opacity-80" />
                <h3 className="text-xl font-bold mb-2">
                  Create Emergency Request
                </h3>
                <p className="text-red-100">Post an urgent blood requirement</p>
              </a>

              <a
                href="/search"
                className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-md p-6 text-white hover:from-blue-700 hover:to-blue-800 transition-colors"
              >
                <Search className="w-10 h-10 mb-3 opacity-80" />
                <h3 className="text-xl font-bold mb-2">Find Donors</h3>
                <p className="text-blue-100">
                  Search for available blood donors
                </p>
              </a>
            </div>
          </>
        )}

        {/* Admin Dashboard */}
        {userType === "admin" && stats && (
          <>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-red-600" />
                  <span className="text-sm text-gray-600">Total</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.donors.total}
                </div>
                <div className="text-sm text-gray-600">Registered Donors</div>
                <div className="mt-2 text-xs text-green-600">
                  {stats.donors.verified} verified
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <Building2 className="w-8 h-8 text-blue-600" />
                  <span className="text-sm text-gray-600">Total</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.bloodBanks.total}
                </div>
                <div className="text-sm text-gray-600">Blood Banks</div>
                <div className="mt-2 text-xs text-green-600">
                  {stats.bloodBanks.verified} verified
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <AlertCircle className="w-8 h-8 text-orange-600" />
                  <span className="text-sm text-gray-600">Active</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.requests.active}
                </div>
                <div className="text-sm text-gray-600">Blood Requests</div>
                <div className="mt-2 text-xs text-red-600">
                  {stats.requests.critical} critical
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <Heart className="w-8 h-8 text-green-600" />
                  <span className="text-sm text-gray-600">Total</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {stats.donations.total}
                </div>
                <div className="text-sm text-gray-600">Donations</div>
                <div className="mt-2 text-xs text-green-600">
                  {stats.donations.thisMonth} this month
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <Shield className="w-10 h-10 text-red-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Verify Users
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Review and verify donor and hospital registrations
                </p>
                <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                  Manage Verifications →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <Users className="w-10 h-10 text-blue-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Manage Users
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  View and manage all registered users
                </p>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View Users →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <AlertCircle className="w-10 h-10 text-orange-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  View Reports
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Generate and view system reports
                </p>
                <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                  Generate Report →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
