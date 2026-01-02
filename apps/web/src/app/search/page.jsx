import { useState, useEffect } from "react";
import { Droplet, Search, MapPin, Phone, Mail } from "lucide-react";

export default function SearchPage() {
  const [searchType, setSearchType] = useState("donors");
  const [bloodGroup, setBloodGroup] = useState("");
  const [city, setCity] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const params = new URLSearchParams();
      if (bloodGroup) params.append("blood_group", bloodGroup);
      if (city) params.append("city", city);
      if (searchType === "donors") params.append("available", "true");

      const endpoint =
        searchType === "donors" ? "/api/donors" : "/api/blood-banks";
      const res = await fetch(`${endpoint}?${params.toString()}`);

      if (res.ok) {
        const data = await res.json();
        setResults(searchType === "donors" ? data.donors : data.bloodBanks);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
                href="/dashboard"
                className="text-gray-700 hover:text-red-600 font-medium"
              >
                Dashboard
              </a>
              <a
                href="/emergency"
                className="text-gray-700 hover:text-red-600 font-medium"
              >
                Emergency Request
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Blood Donors & Banks
          </h1>
          <p className="text-xl text-gray-600">
            Search for available donors or blood banks in your area
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <form onSubmit={handleSearch}>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Search For
                </label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="donors">Blood Donors</option>
                  <option value="banks">Blood Banks</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Blood Group
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Search className="w-5 h-5" />
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {results.length}{" "}
                {searchType === "donors" ? "Donors" : "Blood Banks"} Found
              </h2>
            </div>

            {results.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-gray-600 text-lg">
                  No results found. Try adjusting your search criteria.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchType === "donors"
                  ? results.map((donor) => (
                      <div
                        key={donor.id}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {donor.full_name}
                            </h3>
                            {donor.is_verified && (
                              <span className="text-xs text-green-600 font-medium">
                                ✓ Verified
                              </span>
                            )}
                          </div>
                          <BloodTypeBadge type={donor.blood_group} />
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          {donor.city && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {donor.city}
                                {donor.state ? `, ${donor.state}` : ""}
                              </span>
                            </div>
                          )}
                          {donor.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{donor.phone}</span>
                            </div>
                          )}
                          {donor.last_donation_date && (
                            <div className="text-xs text-gray-500 mt-2">
                              Last donation:{" "}
                              {new Date(
                                donor.last_donation_date,
                              ).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  : results.map((bank) => (
                      <div
                        key={bank.id}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {bank.hospital_name}
                          </h3>
                          {bank.is_verified && (
                            <span className="text-xs text-green-600 font-medium">
                              ✓ Verified
                            </span>
                          )}
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>
                              {bank.address}, {bank.city}
                              {bank.state ? `, ${bank.state}` : ""}
                            </span>
                          </div>
                          {bank.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{bank.phone}</span>
                            </div>
                          )}
                          {bank.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <span className="text-xs">{bank.email}</span>
                            </div>
                          )}
                        </div>

                        {bank.stock && bank.stock.length > 0 && (
                          <div>
                            <div className="text-xs font-medium text-gray-700 mb-2">
                              Available Stock:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {bank.stock
                                .filter((s) => s.units_available > 0)
                                .map((s) => (
                                  <div key={s.blood_group} className="text-xs">
                                    <BloodTypeBadge type={s.blood_group} />
                                    <span className="ml-1 text-gray-600">
                                      ({s.units_available})
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
