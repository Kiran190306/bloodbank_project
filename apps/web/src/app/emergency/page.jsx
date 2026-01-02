import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  Droplet,
  AlertCircle,
  MapPin,
  Phone,
  Calendar,
  Building2,
  LogOut,
  Filter,
  X,
  Plus,
} from "lucide-react";

export default function EmergencyPage() {
  const { data: user, loading: userLoading } = useUser();
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filters, setFilters] = useState({
    bloodGroup: "",
    urgency: "",
    city: "",
  });
  const [formData, setFormData] = useState({
    patient_name: "",
    blood_group: "",
    units_needed: 1,
    urgency_level: "normal",
    hospital_name: "",
    contact_phone: "",
    city: "",
    state: "",
    required_by: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (!userLoading && user) {
      fetchProfile();
    }
  }, [user, userLoading]);

  useEffect(() => {
    fetchRequests();
  }, [filters]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("status", "active");
      if (filters.bloodGroup) params.append("blood_group", filters.bloodGroup);
      if (filters.urgency) params.append("urgency_level", filters.urgency);
      if (filters.city) params.append("city", filters.city);

      const res = await fetch(`/api/blood-requests?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      } else {
        throw new Error("Failed to fetch requests");
      }
    } catch (err) {
      console.error(err);
      setError("Could not load blood requests");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/blood-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create request");
      }

      setSuccess("Blood request created successfully!");
      setShowCreateForm(false);
      setFormData({
        patient_name: "",
        blood_group: "",
        units_needed: 1,
        urgency_level: "normal",
        hospital_name: "",
        contact_phone: "",
        city: "",
        state: "",
        required_by: "",
        description: "",
      });
      fetchRequests();
    } catch (err) {
      console.error(err);
      setError(err.message);
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

  const UrgencyBadge = ({ level }) => {
    const colors = {
      critical: "bg-red-100 text-red-700 border-red-300",
      urgent: "bg-orange-100 text-orange-700 border-orange-300",
      normal: "bg-blue-100 text-blue-700 border-blue-300",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[level] || "bg-gray-100 text-gray-700"}`}
      >
        {level.toUpperCase()}
      </span>
    );
  };

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
              {user ? (
                <>
                  <a
                    href="/dashboard"
                    className="text-gray-700 hover:text-red-600 font-medium"
                  >
                    Dashboard
                  </a>
                  <a
                    href="/account/logout"
                    className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="/account/signin"
                    className="text-gray-700 hover:text-red-600 font-medium"
                  >
                    Sign In
                  </a>
                  <a
                    href="/account/signup"
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium"
                  >
                    Join Now
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Emergency Blood Requests
              </h1>
              <p className="text-gray-600">
                Help save lives by responding to urgent blood requirements
              </p>
            </div>
            {user && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Request
              </button>
            )}
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Filter Requests
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Group
              </label>
              <select
                value={filters.bloodGroup}
                onChange={(e) =>
                  setFilters({ ...filters, bloodGroup: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Blood Groups</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level
              </label>
              <select
                value={filters.urgency}
                onChange={(e) =>
                  setFilters({ ...filters, urgency: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Urgency Levels</option>
                <option value="critical">Critical</option>
                <option value="urgent">Urgent</option>
                <option value="normal">Normal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={filters.city}
                onChange={(e) =>
                  setFilters({ ...filters, city: e.target.value })
                }
                placeholder="Enter city name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() =>
                  setFilters({ bloodGroup: "", urgency: "", city: "" })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-600">
              Loading requests...
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Active Requests
              </h3>
              <p className="text-gray-600">
                There are no blood requests matching your filters at the moment.
              </p>
            </div>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {request.patient_name}
                      </h3>
                      <BloodTypeBadge type={request.blood_group} />
                      <UrgencyBadge level={request.urgency_level} />
                    </div>
                    {request.hospital_name && (
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Building2 className="w-4 h-4" />
                        <span>{request.hospital_name}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-red-600">
                      {request.units_needed}
                    </div>
                    <div className="text-sm text-gray-600">units needed</div>
                  </div>
                </div>

                {request.description && (
                  <p className="text-gray-700 mb-4 bg-gray-50 p-3 rounded-lg">
                    {request.description}
                  </p>
                )}

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {request.city}
                      {request.state && `, ${request.state}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <a
                      href={`tel:${request.contact_phone}`}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      {request.contact_phone}
                    </a>
                  </div>
                  {request.required_by && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>
                        Required by:{" "}
                        {new Date(request.required_by).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Posted {new Date(request.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`tel:${request.contact_phone}`}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium text-center"
                  >
                    Contact Now
                  </a>
                  <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700">
                    Share
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Request Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Create Blood Request
              </h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="p-6">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.patient_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          patient_name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Group *
                    </label>
                    <select
                      required
                      value={formData.blood_group}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          blood_group: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Units Needed *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.units_needed}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          units_needed: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urgency Level *
                    </label>
                    <select
                      required
                      value={formData.urgency_level}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          urgency_level: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hospital Name
                  </label>
                  <input
                    type="text"
                    value={formData.hospital_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hospital_name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.contact_phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact_phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Required By
                    </label>
                    <input
                      type="date"
                      value={formData.required_by}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          required_by: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Details
                  </label>
                  <textarea
                    rows="4"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Any additional information about the requirement..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium"
                >
                  Create Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
